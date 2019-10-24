import styled from 'styled-components';
import { Card, CardActions, Avatar } from '@material-ui/core';
import { green } from "@material-ui/core/colors";

const Wrapper = styled(Card)`
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
  margin-right: auto;
  margin-left: ${({ theme }) => theme.spacing(1)}px;
`

export { Wrapper, CardActionsWrapper, AvatarWrapper }