import styled from 'styled-components';
import { Card, CardActions, Avatar } from '@material-ui/core';
import { green } from "@material-ui/core/colors";

const CardWrapper = styled(Card)`
  background-color: ${({ selected }) => selected ? green[200] : null };
`

const CardActionsWrapper = styled(CardActions)`
  justify-content: flex-end;
`

const AvatarWrapper = styled(Avatar)`
  color: white;
  background-color: ${green[500]};
  width: 25px;
  height: 25px;
  font-size: 12px;
  margin: 3px auto 3px 3px;
`
export { CardWrapper, CardActionsWrapper, AvatarWrapper }