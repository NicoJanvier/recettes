import { amber } from '@material-ui/core/colors';
import { rem } from 'polished';

const theme = {
  palette: {
    primary: {
      main: '#388e3c',
    },
    secondary: amber,
  },
  radius: {
    s: rem(4),
    m: rem(8),
    l: rem(16),
  },
}

export default theme