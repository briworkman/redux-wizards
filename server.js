const express = require('express');
const cors = require('cors');
const port = 5000;

const server = express();
server.use(express.json());
server.use(cors());

const sendUserError = (msg, res) => {
  res.status(422);
  res.json({ Error: msg });
  return;
};

let wizards = [
  {
    name: 'Harry',
    age: 11,
    id: 0,
  },
  {
    name: 'Hermoine',
    age: 12,
    id: 1,
  },
  {
    name: 'Ron',
    age: 11,
    id: 2,
  },
];
server.get('/', (req, res) => {
  res.json(wizards);
});
let wizardId = wizards.length;

server.post('/', (req, res) => {
  const { name, age } = req.body;
  const newWizard = { name, age, id: wizardId };
  if (!name || !age) {
    return sendUserError(
      'Oh No! name and age are all required to add a wizard to hogwarts!',
      res
    );
  }
  const findWizardByName = (wizard) => {
    return wizard.name === name;
  };
  if (wizards.find(findWizardByName)) {
    return sendUserError(`Uh oh! ${name} already attends Hogwarts.`, res);
  }

  wizards.push(newWizard);
  wizardId++;
  res.json(wizards);
});

server.put('/wizards/:id', (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  const findWizardById = (wizard) => {
    return wizard.id == id;
  };
  const foundWizard = wizards.find(findWizardById);
  if (!foundWizard) {
    return sendUserError('No Wizard found by that ID', res);
  } else {
    if (name) foundWizard.name = name;
    if (age) foundWizard.age = age;
    res.json(wizards);
  }
});

server.delete('/wizards/:id', (req, res) => {
  const { id } = req.params;
  const foundWizard = wizards.find((wizard) => wizard.id == id);

  if (foundWizard) {
    const WizardRemoved = { ...foundWizard };
    wizards = wizards.filter((wizard) => wizard.id != id);
    res.status(200).json(wizards);
  } else {
    sendUserError('No wizard by that ID attends hogwarts', res);
  }
});

server.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`server is listening on port ${port}`);
});
