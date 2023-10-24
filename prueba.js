const bcrypt = require('bcrypt');
const assert = require('assert'); // Para realizar las afirmaciones

// Función para hashear y verificar la contraseña
async function testBcrypt() {
  const plainPassword = 'contraseñaSegura123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Verificar que la contraseña hasheada sea diferente de la original
  assert.notStrictEqual(plainPassword, hashedPassword);

  // Verificar que la contraseña ingresada coincida con la contraseña hasheada
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  assert.strictEqual(isMatch, true);
}

// Ejecutar la prueba
testBcrypt()
  .then(() => {
    console.log('La prueba de bcrypt fue exitosa.');
  })
  .catch((error) => {
    console.error('Error en la prueba de bcrypt:', error);
  });
