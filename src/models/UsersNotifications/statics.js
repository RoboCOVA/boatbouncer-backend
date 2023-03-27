import { getPaginationValues } from '../../utils';
import { notFound, updateFailed } from './errors';

export async function getNotifications(pageNo, size, userId) {
  const { skip, limit } = getPaginationValues(pageNo, size);
  const query = [
    {
      $match: {
        $expr: {
          $eq: [
            '$user',
            {
              $toObjectId: userId,
            },
          ],
        },
      },
    },
    {
      $lookup: {
        from: 'notifications',
        let: {
          notificationId: '$notifications',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$notificationId'],
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $project: {
              seen: {
                $cond: {
                  if: {
                    $in: [userId, '$seenBy'],
                  },
                  then: true,
                  else: false,
                },
              },
              clicked: {
                $cond: {
                  if: {
                    $in: [userId, '$clickedBy'],
                  },
                  then: true,
                  else: false,
                },
              },
              content: 1,
              actionType: 1,
              modelType: 1,
              model: 1,
              userType: 1,
              createdBy: 1,
              createdAt: 1,
              updatedAt: 1,
              clickedBy: 1,
              seenBy: 1,
              parentId: 1,
              title: 1,
            },
          },
        ],
        as: 'userNotifications',
      },
    },
    {
      $unwind: {
        path: '$userNotifications',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$userNotifications'],
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $sort: {
        seen: 1,
      },
    },
    {
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
        metadata: [
          {
            $count: 'total',
          },
        ],
        counts: [
          {
            $group: {
              _id: 'null',
              readCount: {
                $sum: {
                  $cond: {
                    if: {
                      $in: [userId, '$seenBy'],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
              unreadCount: {
                $sum: {
                  $cond: {
                    if: {
                      $not: {
                        $in: [userId, '$seenBy'],
                      },
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        data: 1,
        dataCount: {
          $arrayElemAt: ['$metadata.total', 0],
        },
        readCount: {
          $arrayElemAt: ['$counts.readCount', 0],
        },
        unreadCount: {
          $arrayElemAt: ['$counts.unreadCount', 0],
        },
      },
    },
  ];

  const userNotification = await this.aggregate(query);
  return userNotification[0] || { data: [], total: 0 };
}

// eslint-disable-next-line import/prefer-default-export
export async function updateUsersNotifications(notificationId, userId) {
  const matchQuery = { user: userId };
  const usersNotification = await this.findOne(matchQuery);

  if (!usersNotification) throw notFound;

  const updateObject = {
    $push: {
      notifications: {
        $each: notificationId,
        $position: 0,
      },
    },
  };

  const updatedUserNotification = await this.findOneAndUpdate(
    matchQuery,
    updateObject,
    { new: true }
  );

  if (!updatedUserNotification) throw updateFailed;

  return updatedUserNotification;
}
