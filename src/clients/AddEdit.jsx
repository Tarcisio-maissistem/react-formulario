import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import firebaseDb from "../_helpers/firebase";
import "firebase/database";
import fetchJsonp from "fetch-jsonp";

import { clientService, alertService } from "@/_services";

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;
  const [chavesId, setChavesId] = useState({});

  const initialValues = {
    cpfcnpj: "",
    rgie: "",
    contato: "",
    fantasia: "",
    razao: "",
    telefone: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    atualizado: "",
    sistema1: "",
    sistema2: "",
    validade: "",
    obs: "",
  };

  const validationSchema = Yup.object().shape({
    cpfcnpj: Yup.string().required("CPF ou CNPJ é Obrigatório"),
    fantasia: Yup.string().min(2).required("Campo Fantasia é Obrigatório"),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    if (isAddMode) {
      createClient(fields, setSubmitting);
    } else {
      updateClient(id, fields, setSubmitting);
    }
  }

  function createClient(fields, setSubmitting) {
    clientService
      .create(fields)
      .then(() => {
        setChavesId({});
        alertService.success("Cliente adicionado", {
          keepAfterRouteChange: true,
        });
        history.push(".");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function updateClient(id, fields, setSubmitting) {
    clientService
      .update(id, fields)
      .then(() => {
        alertService.success("Cliente atualizado", {
          keepAfterRouteChange: true,
        });
        history.push("..");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function onBlurCNPJ(ev, setFieldValue) {
    const { value } = ev.target;
    //a interrogação depois da variavel identifica se exite tal variavel
    const campoCNPJ = value?.replace(/[^0-9]/g, "");

    if (campoCNPJ?.length !== 14) {
      return;
    }
    fetchJsonp("https://www.receitaws.com.br/v1/cnpj/" + campoCNPJ)
      .then((res) => res.json())
      .then((data) => {
        setFieldValue("contato", data.nome);
        setFieldValue("cpfcnpj", data.cnpj.replace(/[^0-9]/g, ""));
        setFieldValue("fantasia", data.fantasia);
        setFieldValue("razao", data.nome);
        setFieldValue("telefone", data.telefone);
        setFieldValue("email", data.email);
        setFieldValue("cep", data.cep.replace(/[^0-9]/g, ""));
        setFieldValue("rua", data.logradouro);
        setFieldValue("numero", data.numero);
        setFieldValue("complemento", data.complemento);
        setFieldValue("bairro", data.bairro);
        setFieldValue("municipio", data.municipio);
        setFieldValue("uf", data.uf);
      });
  }

  function onBlurCep(ev, setFieldValue) {
    const { value } = ev.target;
    //a interrogação depois da variavel identifica se exite tal variavel
    const cep = value?.replace(/[^0-9]/g, "");
    if (cep?.length !== 8) {
      return;
    }

    fetchJsonp(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setFieldValue("rua", data.logradouro);
        setFieldValue("bairro", data.bairro);
        setFieldValue("cidade", data.localidade);
        setFieldValue("uf", data.uf);
      });
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => {
        const [client, setClient] = useState({});

        useEffect(() => {
          let unmounted = false;
          if (!isAddMode) {
            firebaseDb.child(`clients/${id}`).once("value", (dataSnapshot) => {
              console.log(dataSnapshot.val());

              setClient({
                ...dataSnapshot.val(),
              });
              setFieldValue("cpfcnpj", dataSnapshot.val().cpfcnpj);
              setFieldValue("rgie", dataSnapshot.val().rgie);
              setFieldValue("contato", dataSnapshot.val().contato);
              setFieldValue("fantasia", dataSnapshot.val().fantasia);
              setFieldValue("razao", dataSnapshot.val().razao);
              setFieldValue("telefone", dataSnapshot.val().telefone);
              setFieldValue("email", dataSnapshot.val().email);
              setFieldValue("cep", dataSnapshot.val().cep);
              setFieldValue("rua", dataSnapshot.val().rua);
              setFieldValue("numero", dataSnapshot.val().numero);
              setFieldValue("complemento", dataSnapshot.val().complemento);
              setFieldValue("bairro", dataSnapshot.val().bairro);
              setFieldValue("cidade", dataSnapshot.val().cidade);
              setFieldValue("uf", dataSnapshot.val().uf);
              setFieldValue("atualizado", dataSnapshot.val().atualizado);
              setFieldValue("sistema1", dataSnapshot.val().sistema1);
              setFieldValue("sistema2", dataSnapshot.val().sistema2);
              setFieldValue("validade", dataSnapshot.val().validade);
              setFieldValue("obs", dataSnapshot.val().obs);
            });
          } else {
            // CONSULTA FIREBASE LISTA DE CLIENTES
            firebaseDb.child("clients").once("value", function (dataSnapshot) {
              let keysId = [];
              dataSnapshot.forEach(function (childSnapshot) {
                let key = childSnapshot.key;
                keysId.push(key);
              });
              // console.log(keysId);
              setChavesId(keysId);
            });
          }
          return () => {
            unmounted = true;
          };
        }, []);

        return (
          <Form>
            <h1>{isAddMode ? "Adicionar Cliente" : "Editar Cliente"}</h1>
            <div className="form-row">
              <div className="form-group col-4">
                <label>CPF/CNPJ</label>
                <Field
                  name="cpfcnpj"
                  type="text"
                  onBlur={(ev) => onBlurCNPJ(ev, setFieldValue)}
                  className={
                    "form-control" +
                    (errors.cpfcnpj && touched.cpfcnpj ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="cpfcnpj"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-4">
                <label>RG / IE</label>
                <Field
                  name="rgie"
                  type="text"
                  className={
                    "form-control" +
                    (errors.rgie && touched.rgie ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="rgie"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-4">
                <label>Contato</label>
                <Field
                  name="contato"
                  type="text"
                  className={
                    "form-control" +
                    (errors.contato && touched.contato ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="contato"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-6">
                <label>Fantasia</label>
                <Field
                  name="fantasia"
                  type="text"
                  className={
                    "form-control" +
                    (errors.fantasia && touched.fantasia ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="fantasia"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-6">
                <label>Razão Social</label>
                <Field
                  name="razao"
                  type="text"
                  className={
                    "form-control" +
                    (errors.razao && touched.razao ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="razao"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-5">
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

              <div className="form-group col-5">
                <label>Telefone</label>
                <Field
                  name="telefone"
                  type="text"
                  className={
                    "form-control" +
                    (errors.telefone && touched.telefone ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>

            <label>
              <strong>Endereço</strong>
            </label>

            <div className="form-row">
              <div className="form-group col-3">
                <label>CEP</label>
                <Field
                  name="cep"
                  type="text"
                  onBlur={(ev) => onBlurCep(ev, setFieldValue)}
                  className={
                    "form-control" +
                    (errors.cep && touched.cep ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-5">
                <label>Rua</label>
                <Field
                  name="rua"
                  type="text"
                  className={
                    "form-control" +
                    (errors.rua && touched.rua ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="rua"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-3">
                <label>Numero</label>
                <Field
                  name="numero"
                  type="text"
                  className={
                    "form-control" +
                    (errors.numero && touched.numero ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="numero"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-5">
                <label>Complemento</label>
                <Field
                  name="complemento"
                  type="text"
                  className={
                    "form-control" +
                    (errors.complemento && touched.complemento
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="complemento"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-5">
                <label>Bairro</label>
                <Field
                  name="bairro"
                  type="text"
                  className={
                    "form-control" +
                    (errors.bairro && touched.bairro ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="bairro"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-5">
                <label>Cidade</label>
                <Field
                  name="cidade"
                  type="text"
                  className={
                    "form-control" +
                    (errors.cidade && touched.cidade ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="cidade"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-3">
                <label>UF</label>
                <Field component="select" className="form-control" name="uf">
                  <option value={null}>Selecione o Estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </Field>
                {/* <Field
                  name="uf"
                  type="text"
                  className={
                    "form-control" +
                    (errors.uf && touched.uf ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="uf"
                  component="div"
                  className="invalid-feedback"
                /> */}
              </div>
            </div>

            <label>
              <strong>Sistemas</strong>
            </label>

            <div className="form-row">
              <div className="form-group col-3">
                <label>Sistema 1</label>
                <Field
                  name="sistema1"
                  as="select"
                  className={
                    "form-control" +
                    (errors.sistema1 && touched.sistema1 ? " is-invalid" : "")
                  }
                >
                  <option value="Gdoor PRO">Gdoor PRO</option>
                  <option value="Gdoor SLIM">Gdoor SLIM</option>
                  <option value="GrFood">GrFood</option>
                  <option value="TEF">TEF</option>
                  <option value="Acronyn Fiscal">Acronyn Fiscal</option>
                  <option value="Acronyn Gestão">Acronyn Gestão</option>
                </Field>
                <ErrorMessage
                  name="sistema1"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-3">
                <label>Sistema 2</label>
                <Field
                  name="sistema2"
                  as="select"
                  className={
                    "form-control" +
                    (errors.sistema2 && touched.sistema2 ? " is-invalid" : "")
                  }
                >
                  <option value="Gdoor PRO">Gdoor PRO</option>
                  <option value="Gdoor SLIM">Gdoor SLIM</option>
                  <option value="GrFood">GrFood</option>
                  <option value="TEF">TEF</option>
                  <option value="Acronyn Fiscal">Acronyn Fiscal</option>
                  <option value="Acronyn Gestão">Acronyn Gestão</option>
                </Field>
                <ErrorMessage
                  name="sistema2"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-3">
                <label>validade</label>
                <Field
                  name="validade"
                  type="date"
                  className={
                    "form-control" +
                    (errors.validade && touched.validade ? " is-invalid" : "")
                  }
                />
                <ErrorMessage name="validade" className="invalid-feedback" />
              </div>

              <div className="form-group col-8">
                <label>Observação</label>
                <Field
                  name="obs"
                  type="textarea"
                  className={
                    "form-control" +
                    (errors.obs && touched.obs ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="obs"
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
