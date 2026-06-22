// Escenario: Procesamiento de transacciones
// Objetivo: El sistema recibe una lista de compras de usuarios. Necesitamos una función que:
// 1. Descarte cualquier transacción que no tenga el estatus 'success'.
// 2. Calcule y devuelva la suma total del 'amount' de las transacciones válidas.

const transactions = [
  { id: 1, amount: 150, status: 'success' },
  { id: 2, amount: 50, status: 'failed' },
  { id: 3, amount: 200, status: 'success' },
  { id: 4, amount: 100, status: 'pending' }
];

function calculateTotalSales(data: any[]) {
  // Tu lógica aquí
}

console.log(calculateTotalSales(transactions)); // El resultado esperado es: 350