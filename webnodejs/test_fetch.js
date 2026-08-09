fetch('http://localhost:3000/api/employees')
  .then(res => res.text())
  .then(text => console.log(text.substring(0, 500)))
  .catch(console.error);
