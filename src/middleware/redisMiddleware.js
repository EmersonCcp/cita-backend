import { client } from "../index.js";

export const deleteKeysByPattern = async (pattern) => {
  try {
    let cursor = "0";
    let keysToDelete = [];
    do {
      let result;

      result = await client.scan(cursor, "MATCH", pattern, "COUNT", 100);

      if (result) {
        // Accedemos correctamente a los valores de cursor y keys
        cursor = result.cursor; // El cursor para la siguiente iteración
        const keys = result.keys; // Las claves obtenidas

        const filteredKeys = keys.filter((key) =>
          key.startsWith("clientes:fk_empresa=1")
        );

        // Agregamos las claves filtradas a la lista de claves a eliminar
        if (filteredKeys.length > 0) {
          keysToDelete = [...keysToDelete, ...filteredKeys];
        }
      }
    } while (cursor !== 0); // Continuamos mientras no hayamos recorrido todas las claves

    // Eliminamos las claves encontradas
    if (keysToDelete.length > 0) {
      await client.del(keysToDelete);

      console.log(`Deleted ${keysToDelete.length} keys.`);
    } else {
      console.log("No keys found to delete.");
    }
  } catch (err) {
    console.error("Error deleting keys:", err);
  }
};
