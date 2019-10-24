import React from "react";
import styled from 'styled-components';
import useForm from "react-hook-form";
import { navigate } from "@reach/router";
import {
  Container,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Grid
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import useRecipe from "./hooks/useRecipe";
import { useUserState } from "../contexts/user";

const Buttons = styled(Grid)`
  display: flex;
  justify-content: flex-end;
  > button + button {
    margin-left: ${({ theme }) => theme.spacing(2)}px;
  }
`

const Recipe = ({ id }) => {
  const { recipe, isLoading, onRemove, onSave } = useRecipe(id);
  const { house } = useUserState();
  const canModify = id === 'new' || recipe.house === house.id;
  const isRecipeEmpty = !recipe.title;
  const { register, errors, handleSubmit, formState } = useForm();

  const onSubmit = data => {
    onSave({
      ...data,
    })
      .then((res) => {
        if (id === "new") {
          const id = res.data.data._id;
          navigate(`/recipes/${id}`);
        }
      })
      .catch(err => console.error(err));
  };
  const onDelete = () => onRemove().then(() => window.history.back());
  return (
    <Container key={id}>
      {!(isLoading && isRecipeEmpty) &&
        <Grid
          container
          spacing={2}
          component="form"
          onSubmit={handleSubmit(data => onSubmit(data))}
        >
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Titre *"
              fullWidth
              inputRef={register({ required: true })}
              error={!!errors.title}
              defaultValue={recipe.title}
              inputProps={{ readOnly: !canModify }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              type="textarea"
              multiline
              fullWidth
              inputRef={register}
              defaultValue={recipe.description}
              inputProps={{ readOnly: !canModify }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Lien"
              name="url"
              type="url"
              defaultValue={recipe.url}
              fullWidth
              inputRef={register}
              inputProps={{ readOnly: !canModify }}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      component="a"
                      aria-label="Open link"
                      disabled={!recipe.url}
                      href={recipe.url}
                      rel="noopener"
                      target="_blank"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={recipe.vegetarian}
                  name="vegetarian"
                  inputRef={register}
                />
              }
              label="Végétarien"
              labelPlacement="end"
            />
          </Grid>
          <Buttons item xs={12}>
            {canModify &&
              <Button
                type="submit"
                disabled={!formState.dirty}
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Sauvegarder
            </Button>
            }
            {(id !== "new") && canModify &&
              <Button
                onClick={() => onDelete().then(() => window.history.back())}
                variant="contained"
                startIcon={<DeleteIcon />}
              >
                Supprimer
            </Button>
            }
          </Buttons>
        </Grid>}
    </Container>
  );
};


export default Recipe;
