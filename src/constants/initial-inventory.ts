import { Book, Sede } from "../generated/prisma";
import prisma from "../lib/prisma";
import { Category } from '../generated/prisma/index';

// funcion para iniciar el inventario de libros en las sedes
// con un stock de 0
// recibe un array de sedes y un array de libros.
// Los libros ya estan definidos en este archivo en la constante `books`

export const seedInventory = async (sedes: Sede[], books: Book[]) => {
  const inventoryData = [];

  for (const sede of sedes) {
    for (const book of books) {
      inventoryData.push({
        sedeId: sede.id,
        bookId: book.id,
        stock: 0,
      });
    }
  }

  // Inserta todos los registros de inventario
  await prisma.inventory.createMany({
    data: inventoryData,
  });

  console.log("Inventario creado con éxito en la (s) sedes.");
};

export const books: {name: string, category: Category}[] = [
  // seminario_sanacion
  { name: "tomo_1_preparandonos_para_ser_sanados", category: "seminario_sanacion" },
  { name: "tomo_2_el_pecado", category: "seminario_sanacion" },
  { name: "tomo_3_el_perdon", category: "seminario_sanacion" },
  { name: "tomo_4_ataduras_heredadas_y_adquiridas", category: "seminario_sanacion" },
  { name: "tomo_5_la_brujeria", category: "seminario_sanacion" },
  { name: "tomo_6_recuerdos_dolorosos", category: "seminario_sanacion" },
  { name: "tomo_7_clases_de_maldiciones", category: "seminario_sanacion" },
  { name: "tomo_8_bautismo_en_el_espiritu_santo", category: "seminario_sanacion" },
  { name: "tomo_9_heridas_de_vientre_materno", category: "seminario_sanacion" },

  // seminario_como_vivir
  { name: "tomo_1_el_espiritu_santo_en_la_oracion", category: "seminario_como_vivir" },
  { name: "tomo_2_la_alabanza", category: "seminario_como_vivir" },
  { name: "tomo_3_armas_espirituales_autoridad", category: "seminario_como_vivir" },
  { name: "tomo_4_armas_espirituales_sangre", category: "seminario_como_vivir" },
  { name: "tomo_5_armas_espirituales_palabra", category: "seminario_como_vivir" },
  { name: "tomo_6_jesus_y_la_oracion", category: "seminario_como_vivir" },
  { name: "tomo_7_tu_puedes_sanar", category: "seminario_como_vivir" },
  { name: "tomo_8_la_intercesion", category: "seminario_como_vivir" },
  { name: "tomo_9_las_promesas_de_dios_son_para_ti", category: "seminario_como_vivir" },

  // seminario_armadura
  { name: "tomo_1_maneras_de_vivir", category: "seminario_armadura" },
  { name: "tomo_2_la_bendicion_a_traves_del_trabajo", category: "seminario_armadura" },
  { name: "tomo_3_que_es_la_bendicion", category: "seminario_armadura" },
  { name: "tomo_4_maneras_como_dios_bendice_provision", category: "seminario_armadura" },
  { name: "tomo_5_maneras_como_dios_bendice_promocion", category: "seminario_armadura" },
  { name: "tomo_6_maneras_como_dios_bendice_proteccion", category: "seminario_armadura" },
  { name: "tomo_7_viviendo_bajo_el_poder_extraordinario_de_dios", category: "seminario_armadura" },
  { name: "tomo_8_el_poder_de_la_bendicion", category: "seminario_armadura" },
  { name: "tomo_9_dar_principio_de_bendicion", category: "seminario_armadura" },

  // Cartillas
  { name: "liderazgo_lider", category: "cartilla" },
  { name: "liderazgo_estudiante", category: "cartilla" },
  { name: "discipulado", category: "cartilla" },
  { name: "familia_en_bendicion", category: "cartilla" },

  // Libros
  { name: "mi_padre_dios", category: "libro" },
  { name: "no_abandones_tus_sueños", category: "libro" },
  { name: "si_confiesas_tus_pecados", category: "libro" },
  { name: "las_promesas_de_dios_son_para_ti", category: "libro" },
  { name: "el_poder_transformador_de_los_pensamientos", category: "libro" },
  { name: "el_sufrimiento_de_hoy_sera_el_testimonio_de_mañana", category: "libro" },
  { name: "dios_mio_dame_fortaleza", category: "libro" },
  { name: "para_ser_libre_te_liberto_cristo", category: "libro" },
  { name: "la_misericordia_dia_a_dia", category: "libro" },
  { name: "preparandonos_para_ser_sanados", category: "libro" },
  { name: "espiritu_santo_quiero_mas_de_ti", category: "libro" },
  { name: "sanando_la_familia_a_traves_del_amor", category: "libro" },
  { name: "señor_aumenta_mi_fe", category: "libro" },
  { name: "una_familia_en_bendicion_1", category: "libro" },
  { name: "una_familia_en_bendicion_2", category: "libro" },
];