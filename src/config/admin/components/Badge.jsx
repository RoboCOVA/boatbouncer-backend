import { Badge } from '@adminjs/design-system';
import { status } from '../utils/constants';

export const commonStyle = {
  border: 'none',
  padding: '7px 15px',
  fontSize: '14px',
  fontWeight: 500,
  minWidth: '5rem',
  borderRadius: '10px',
  height: 'auto',
  whiteSpace: 'nowrap',
};

export default function Badges({ stat, text }) {
  switch (stat) {
    case status.cancelled:
      return (
        <Badge
          color="rgb(255,159,67)"
          style={{
            ...commonStyle,
            backgroundColor: 'rgba(255,159,67,0.16)',
          }}
        >
          {text}
        </Badge>
      );

    case status.deleted:
      return (
        <Badge
          color="rgb(234,84,85)"
          style={{
            ...commonStyle,
            backgroundColor: 'rgba(234,84,85,0.16)',
            textDecoration: 'line-through',
          }}
        >
          {text}
        </Badge>
      );

    case status.completed:
      return (
        <Badge
          color="rgb(40,199,111)"
          style={{
            ...commonStyle,
            backgroundColor: 'rgba(40,199,111,0.16)',
          }}
        >
          {text}
        </Badge>
      );

    case status.pending:
      return (
        <Badge
          color="rgb(115,103,240)"
          style={{
            ...commonStyle,
            backgroundColor: 'rgba(115,103,240,0.16)',
            color: '#3040d6',
          }}
        >
          {text}
        </Badge>
      );

    case status.active:
      return (
        <Badge
          color="rgb(0,207,232)"
          style={{ ...commonStyle, backgroundColor: 'rgba(0,207,232,0.16)' }}
        >
          {text}
        </Badge>
      );

    default:
      return null;
  }
}
