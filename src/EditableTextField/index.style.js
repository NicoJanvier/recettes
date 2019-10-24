import styled from 'styled-components';
import { IconButton } from '@material-ui/core';

const ActionButton = styled(IconButton)`
  padding: 0 0 0 ${({ theme }) => theme.spacing(1)}px;
`

export { ActionButton }