import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { userService, alertService } from "@/_services";

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;

  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Título é obrigatório"),
    firstName: Yup.string().required("Primeiro Nome é Obrigatório"),
    lastName: Yup.string().required("Sobre Name é Obrigatório"),
    email: Yup.string()
      .email("Email é inválido")
      .required("Email é Obrigatório"),
    role: Yup.string().required("Tipo é Obrigatório"),
    password: Yup.string()
      .concat(isAddMode ? Yup.string().required("Senha é Obrigatório") : null)
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: Yup.string()
      .when("password", (password, schema) => {
        if (password || isAddMode)
          return schema.required("É necessário confirmar a senha");
      })
      .oneOf([Yup.ref("password")], "É necessário confirmar a senha"),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (isAddMode) {
      // SE O ID É VAZIO - SETA FUNÇAO createUser - NOVO CADASTRO
      createUser(fields, setSubmitting);
    } else {
      // SE O ID TEM VALORES - SETA FUNÇAO updateUser - EDITAR CADASTRO
      updateUser(id, fields, setSubmitting);
    }
  }

  function createUser(fields, setSubmitting) {
    userService
      .create(fields)
      .then(() => {
        alertService.success("Usuário adicionado", {
          keepAfterRouteChange: true,
        });
        history.push(".");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function updateUser(id, fields, setSubmitting) {
    userService
      .update(id, fields)
      .then(() => {
        alertService.success("Usuário atualizado", {
          keepAfterRouteChange: true,
        });
        history.push("..");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => {
        const [user, setUser] = useState({});
        const [showPassword, setShowPassword] = useState(false);

        useEffect(() => {
          if (!isAddMode) {
            // obter o usuário e definir os campos do formulário
            userService.getById(id).then((user) => {
              const fields = [
                "title",
                "firstName",
                "lastName",
                "email",
                "role",
              ];
              fields.forEach((field) =>
                setFieldValue(field, user[field], false)
              );
              console.log(user);

              setUser(user);
            });
          }
        }, []);

        return (
          <Form>
            <h1>{isAddMode ? "Adicionar Usuário" : "Editar Usuário"}</h1>
            <div className="form-row">
              <div className="form-group col">
                <label>Título</label>
                <Field
                  name="title"
                  as="select"
                  className={
                    "form-control" +
                    (errors.title && touched.title ? " is-invalid" : "")
                  }
                >
                  <option value=""></option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                </Field>
                <ErrorMessage
                  name="title"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col-5">
                <label>Primeiro Nome</label>
                <Field
                  name="firstName"
                  type="text"
                  className={
                    "form-control" +
                    (errors.firstName && touched.firstName ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col-5">
                <label>Sobre Nome</label>
                <Field
                  name="lastName"
                  type="text"
                  className={
                    "form-control" +
                    (errors.lastName && touched.lastName ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-7">
                <label>Email</label>
                <Field
                  name="email"
                  type="text"
                  className={
                    "form-control" +
                    (errors.email && touched.email ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col">
                <label>Função</label>
                <Field
                  name="role"
                  as="select"
                  className={
                    "form-control" +
                    (errors.role && touched.role ? " is-invalid" : "")
                  }
                >
                  <option value=""></option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            {!isAddMode && (
              <div>
                <h3 className="pt-3">Alterar a senha</h3>
                <p>Deixe em branco para manter a mesma senha</p>
              </div>
            )}
            <div className="form-row">
              <div className="form-group col">
                <label>
                  Senha
                  {!isAddMode &&
                    (!showPassword ? (
                      <span>
                        {" "}
                        -{" "}
                        <a
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-primary"
                        >
                          mostrar
                        </a>
                      </span>
                    ) : (
                      <span> - {user.password}</span>
                    ))}
                </label>
                <Field
                  name="password"
                  type="password"
                  className={
                    "form-control" +
                    (errors.password && touched.password ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col">
                <label>Confirme a Senha</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className={
                    "form-control" +
                    (errors.confirmPassword && touched.confirmPassword
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Salvar
              </button>
              <Link to={isAddMode ? "." : ".."} className="btn btn-link">
                Cancelar
              </Link>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export { AddEdit };
