const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const post = require("./models/post");

/* app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars"); */

app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
    helpers: {
      formatDate: function (dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      },
    },
  })
);
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", function (req, res) {
  res.render("primeira_pagina");
});

function formatPhoneNumber(phoneNumberString) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const matchC = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  const matchF = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
  if (matchC) {
    return "(" + matchC[1] + ") " + matchC[2] + "-" + matchC[3];
  } else if (matchF) {
    return "(" + matchF[1] + ") " + matchF[2] + "-" + matchF[3];
  }
  return null;
}

function formatDate(dateString) {
  const cleaned = ("" + dateString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (match) {
    return match[3] + "-" + match[2] + "-" + match[1];
  }
  return null;
}

app.get("/consulta", function (req, res) {
  post
    .findAll()
    .then(function (posts) {
      const formattedPosts = posts.map((post) => {
        return {
          ...post,
          telefone: formatPhoneNumber(post.telefone),
          data_contato: formatDate(post.data_contato),
        };
      });
      res.render("consulta", { post: formattedPosts });
    })
    .catch(function (erro) {
      console.log("Erro ao carregar dados do banco: " + erro);
    });
});

app.get("/editar/:id", function (req, res) {
  post
    .findAll({ where: { id: req.params.id } })
    .then(function (post) {
      res.render("editar", { post });
    })
    .catch(function (erro) {
      console.log("Erro ao carregar dados do banco: " + erro);
    });
});
/* app.get("/excluir/:id", function (req, res) {
  post
    .destroy({ where: { id: req.params.id } })
    .then(function () {
      res.render("primeira_pagina");
    })
    .catch(function (erro) {
      console.log("Erro ao excluir ou encontrar os dados do banco: " + erro);
    });
}); */

app.get("/excluir/:id", function (req, res) {
  post
    .destroy({
      where: {
        id: req.params.id,
      },
    })
    .then(() => {
      res.redirect("/consulta");
    })
    .catch((erro) => {
      console.log("Erro ao excluir os dados: " + erro);
    });
});

app.post("/cadastrar", function (req, res) {
  post
    .create({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao,
    })
    .then(function () {
      res.redirect("/");
    })
    .catch(function (erro) {
      res.send("Falha ao cadastrar os dados: " + erro);
    });
});
app.post("/atualizar", function (req, res) {
  post
    .update(
      {
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    )
    .then(function () {
      res.redirect("/consulta");
    });
});

app.post("/excluir", function (req, res) {
  Agendamentos.destroy({
    where: {
      id: req.body.id,
    },
  })
    .then(() => {
      res.redirect("/consulta");
    })
    .catch((erro) => {
      console.log("Erro ao excluir os dados: " + erro);
    });
});

app.listen(8081, function () {
  console.log("Servidor ativo!");
});
