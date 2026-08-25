/**
 * Boat names are not unique and are not identifiers.
 *
 * There used to be a global name check here, which meant the first owner to
 * list a "Serendipity" took that name from everyone else on the platform — and
 * duplicate names are ordinary: two owners in different marinas routinely use
 * the same one. Nothing keys off the name (`boatName` carries no unique index,
 * and bookings reference boats by `_id`), so there was nothing to protect.
 *
 * The check was also wrong in three ways worth remembering, in case anyone is
 * tempted to reintroduce it:
 *   - it interpolated the name straight into a `RegExp`, so a name containing
 *     `.` or `*` matched listings it had nothing to do with, and a crafted name
 *     could hang Mongo's regex engine;
 *   - it counted soft-deleted boats, so deleting a listing reserved its name
 *     forever;
 *   - it was check-then-insert with no unique index, so two concurrent creates
 *     both passed it anyway.
 */
export async function createBoat() {
  const boat = await this.save();
  return boat;
}
