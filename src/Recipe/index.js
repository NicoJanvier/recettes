import React from "react";
import PropTypes from "prop-types";
import useForm from "react-hook-form";
import { navigate } from "@reach/router";
import { Container, TextField, Button, InputAdornment, IconButton, FormControlLabel, Checkbox } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import useRecipe from "./hooks/useRecipe";
import { useUserState } from "../contexts/user";
// import Dates from "../Dates";

const Recipe = ({ id }) => {
  const { recipe, isLoading, onRemove, onSave } = useRecipe(id);
  const { house } = useUserState();
  const canModify = recipe.house === house.id;
  const isRecipeEmpty = !recipe.title;
  const { register, errors, handleSubmit, formState, setValue, getValues } = useForm();

  // const { isValid, touched } = formState;
  const formRef = React.useRef(null);
  // React.useEffect(() => {
  //   const values = getValues();
  //   if (id !== "new" && isValid && touched.includes("dates") && values.dates && JSON.parse(values.dates).length !== recipe.dates.length) {
  //     const timer = setTimeout(() => {
  //       formRef.current.dispatchEvent(new Event('submit'));
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isValid, touched, getValues, recipe, formRef, id]);

  const onSubmit = data => {
    onSave({
      ...data,
      // dates: JSON.parse(data.dates),
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
        <form ref={formRef} onSubmit={handleSubmit(data => onSubmit(data))}>
          <TextField
            name="title"
            label="Titre *"
            fullWidth
            inputRef={register({ required: true })}
            error={!!errors.title}
            defaultValue={recipe.title}
            inputProps={{ readOnly: !canModify }}
          />
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
          {/* <Dates
            name="dates"
            label="Dates"
            value={recipe.dates}
            register={register}
            onChange={val => setValue('dates', val)}
          /> */}
          {canModify &&
            <Button
              type="submit"
              disabled={!formState.dirty}
              variant="outlined"
            >
              Sauvegarder
            </Button>
          }
          {(id !== "new") && canModify &&
            <Button onClick={() => onDelete().then(() => window.history.back())} variant="contained">
              <DeleteIcon /> Supprimer
            </Button>
          }
        </form>}
    </Container>
  );
};

Recipe.propTypes = {
  id: PropTypes.string,
};

export default Recipe;
