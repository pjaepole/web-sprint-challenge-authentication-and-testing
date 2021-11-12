
const userexample = [
  { username: 'snapple', 
    password:'$2a$08$GpFOBWB98X5OAlISEfv3EeoTZdGQj6.JpYkzRozpjevxy9joejp9q' },
  { username: 'snapple2', 
    password:'$2a$08$Gh7h2ZAgHIYqUeCCNNL4eOr1mmjMHIqq793xtDQDVwUNI1My8FmsW' },
  { username: 'snapple3',   
    password:'$2a$08$JWYGO1UnV6iTKQ.lJ1EGt.ljPBhRfNAw7QtBFKP1DeW.hlaE0/rNC' },
]


exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .truncate()
    .then(function() {
      return knex('users').insert(userexample);
    });
};