import React, { useEffect, useState, useRef } from "react";
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
  const [client, setClient] = useState(initialValues);

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
    registro: "",
    anydesk: "",
    mensalidade: "",
    receberdia: "",
    custo: "",
    pagardia: ""
  };

  const validationSchema = Yup.object().shape({
    cpfcnpj: Yup.string().required("CPF ou CNPJ é Obrigatório"),
    fantasia: Yup.string().min(2).required("Campo Fantasia é Obrigatório")
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
    let upClient = firebaseDb
      .firestore()
      .collection("clients")
      .doc(fields.cpfcnpj)
      .set(fields)
      .then(() => {
        alertService.success("Cliente adicionado", {
          keepAfterRouteChange: true
        });
        history.push(".");
        // setClient(initialValues);
        // setClient({ ...initialValues });
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });

    console.log("Cliente Adicionado!");
    setClient({ ...initialValues });
    return () => upClient();
  }

  function updateClient(id, fields, setSubmitting) {
    const upClient = firebaseDb
      .firestore()
      .collection("clients")
      .doc(id)
      .update(fields)
      .then(() => {
        alertService.success("Cliente atualizado", {
          keepAfterRouteChange: true
        });
        history.push("..");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });

    console.log("Cliente Atualizado");
    return () => upClient();
  }

  function onBlurCNPJ(ev, setFieldValue) {
    const { value } = ev.target;
    //a interrogação depois da variavel identifica se exite tal variavel
    const campoCNPJ = value?.replace(/[^0-9]/g, "");
    if (campoCNPJ?.length !== 14) {
      return;
    }
    fetchJsonp(`https://www.receitaws.com.br/v1/cnpj/${campoCNPJ}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.qsa[0] != undefined) {
          setFieldValue("contato", data.qsa[0].nome);
        }

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
        useEffect(() => {
          if (isAddMode) {
            setFieldValue({ ...initialValues });
          } else {
            let listClient = firebaseDb
              .firestore()
              .collection("clients")
              .doc(id)
              .onSnapshot((dataSnapshot) => {
                setFieldValue("cpfcnpj", dataSnapshot.data().cpfcnpj);
                setFieldValue("rgie", dataSnapshot.data().rgie);
                setFieldValue("contato", dataSnapshot.data().contato);
                setFieldValue("fantasia", dataSnapshot.data().fantasia);
                setFieldValue("razao", dataSnapshot.data().razao);
                setFieldValue("telefone", dataSnapshot.data().telefone);
                setFieldValue("email", dataSnapshot.data().email);
                setFieldValue("cep", dataSnapshot.data().cep);
                setFieldValue("rua", dataSnapshot.data().rua);
                setFieldValue("numero", dataSnapshot.data().numero);
                setFieldValue("complemento", dataSnapshot.data().complemento);
                setFieldValue("bairro", dataSnapshot.data().bairro);
                setFieldValue("cidade", dataSnapshot.data().cidade);
                setFieldValue("uf", dataSnapshot.data().uf);
                setFieldValue("atualizado", dataSnapshot.data().atualizado);
                setFieldValue("sistema1", dataSnapshot.data().sistema1);
                setFieldValue("sistema2", dataSnapshot.data().sistema2);
                setFieldValue("validade", dataSnapshot.data().validade);
                setFieldValue("obs", dataSnapshot.data().obs);
                setFieldValue("registro", dataSnapshot.data().registro);
                setFieldValue("anydesk", dataSnapshot.data().anydesk);
                setFieldValue("mensalidade", dataSnapshot.data().mensalidade);
                setFieldValue("receberdia", dataSnapshot.data().receberdia);
                setFieldValue("custo", dataSnapshot.data().custo);
                setFieldValue("pagardia", dataSnapshot.data().pagardia);
              });
            return () => listClient();
          }
        }, [id]);

        return (
          <Form>
            <h1>{isAddMode ? "Adicionar Cliente" : "Editar Cliente"}</h1>
            <div className="form-row">
              <div className="form-group col-4">
                <label>CPF ou CNPJ</label>
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
                <label>RG ou IE</label>
                <Field name="rgie" type="text" className="form-control" />
              </div>

              <div className="form-group col-4">
                <label>Contato</label>
                <Field name="contato" type="text" className="form-control" />
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
                <Field name="razao" type="text" className="form-control" />
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
              <div className="form-group col-2">
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
                  name="cep"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="form-group col-5">
                <label>Rua</label>
                <Field name="rua" type="text" className="form-control" />
              </div>

              <div className="form-group col-2">
                <label>Número</label>
                <Field name="numero" type="text" className="form-control" />
              </div>

              <div className="form-group col-3">
                <label>Complemento</label>
                <Field
                  name="complemento"
                  type="text"
                  className="form-control"
                />
              </div>

              <div className="form-group col-4">
                <label>Bairro</label>
                <Field name="bairro" type="text" className="form-control" />
              </div>

              <div className="form-group col-5">
                <label>Cidade</label>
                <Field name="cidade" type="text" className="form-control" />
              </div>

              <div className="form-group col-3">
                <label>Estado</label>
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
              </div>
            </div>

            <label>
              <strong>Sistemas</strong>
            </label>

            <div className="form-row">
              <div className="form-group col-3">
                <label>Sistema 1</label>
                <Field name="sistema1" as="select" className="form-control">
                  <option value="Nenhum">Nenhum</option>
                  <option value="Gdoor_PRO">Gdoor PRO</option>
                  <option value="Gdoor_SLIM">Gdoor SLIM</option>
                  <option value="GrFood">GRFood</option>
                  <option value="Acronyn_Fiscal">Acronyn Fiscal</option>
                  <option value="TEF">TEF</option>
                </Field>
              </div>

              <div className="form-group col-3">
                <label>Sistema 2</label>
                <Field name="sistema2" as="select" className="form-control">
                  <option value="Nenhum">Nenhum</option>
                  <option value="Gdoor_PRO">Gdoor PRO</option>
                  <option value="Gdoor_SLIM">Gdoor SLIM</option>
                  <option value="GrFood">GRFood</option>
                  <option value="Acronyn_Fiscal">Acronyn Fiscal</option>
                  <option value="TEF">TEF</option>
                </Field>
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
              <div className="form-row">
                <div className="form-group col-6">
                  <label>Número de Registro</label>
                  <Field name="registro" type="text" className="form-control" />
                </div>
                <div className="form-group col-5">
                  <label>Anydesk</label>
                  <Field name="anydesk" type="text" className="form-control" />
                </div>
              </div>

              <div className="form-group col-12">
                <label>Observação</label>
                <Field name="obs" type="textarea" className="form-control" />
              </div>
            </div>

            <label>
              <strong>Financeiro</strong>
            </label>

            <div className="form-row">
              <div className="form-group col-2">
                <label>Mensalidade</label>
                <Field
                  name="mensalidade"
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="form-group col-2">
                <label>Receber:</label>
                <Field name="receberdia" type="text" className="form-control" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-2">
                <label>Custo</label>
                <Field name="custo" type="text" className="form-control" />
              </div>

              <div className="form-group col-2">
                <label>Pagar:</label>
                <Field name="pagardia" type="text" className="form-control" />
              </div>
            </div>

            <div className="form-group">
              {/* <button
                type="submit"
                // className="btn btn-success btn-block"
                disabled={isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
              >
                {isAddMode ? "Salvar" : "Atualizar"}
              </button> */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success"
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                {isAddMode ? "Salvar" : "Atualizar"}
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
