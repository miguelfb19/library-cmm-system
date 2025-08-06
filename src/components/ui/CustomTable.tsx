"use client";

/**
 * Definición de una columna para la tabla
 * @interface Column
 */
interface Column {
  /** La clave/propiedad del objeto de datos que se mostrará en esta columna */
  key: string;
  /** El texto que se mostrará en el encabezado de la columna */
  header: string;
  /** Función opcional para personalizar cómo se renderiza el contenido de la celda
   * @param value - El valor de la propiedad para esta fila
   * @param row - El objeto completo de la fila (útil para acceder a otras propiedades)
   * @returns Un elemento React que se renderizará en la celda
   */
  render?: (value: any, row: any) => React.ReactNode;
}

/**
 * Props del componente CustomTable
 * @interface Props
 * @template T - Tipo genérico que debe extender Record<string, any> para asegurar que sea un objeto
 */
interface Props<T = any> {
  /** Array de definiciones de columnas */
  columns: Column[];
  /** Array de datos a mostrar en la tabla */
  data: T[];
  /** Clases CSS opcionales para el contenedor principal */
  containerClassName?: string;
  /** Clases CSS opcionales para el elemento table */
  tableClassName?: string;
  /** Clases CSS opcionales para el encabezado (thead) */
  headerClassName?: string;
  /** Clases CSS opcionales para las filas del cuerpo (tbody tr) */
  rowClassName?: string;
}

/**
 * Componente de tabla personalizable y reutilizable
 * 
 * Este componente permite crear tablas dinámicas basadas en una configuración de columnas
 * y un array de datos. Soporta renderizado personalizado para cada celda y es completamente
 * estilizable mediante clases CSS.
 * 
 * @template T - Tipo genérico para los datos de la tabla
 * @param columns - Configuración de las columnas de la tabla
 * @param data - Array de objetos con los datos a mostrar
 * @param containerClassName - Clases CSS para el contenedor con scroll
 * @param tableClassName - Clases CSS para el elemento table
 * @param headerClassName - Clases CSS para el header de la tabla
 * @param rowClassName - Clases CSS para las filas del cuerpo
 * 
 * @returns Elemento JSX de la tabla
 */
export const CustomTable = <T extends Record<string, any>>({
  columns,
  data,
  containerClassName,
  tableClassName,
  headerClassName,
  rowClassName,
}: Props<T>) => {
  return (
    /* Contenedor principal con scroll horizontal automático */
    <div className={`overflow-auto ${containerClassName}`}>
      {/* Tabla principal con ancho mínimo responsivo */}
      <table
        className={`min-w-[50rem] md:min-w-full text-sm text-center ${tableClassName}`}
      >
        {/* Encabezado de la tabla */}
        <thead className={`bg-secondary font-bold ${headerClassName}`}>
          <tr className="border-b h-10">
            {/* Renderiza dinámicamente cada encabezado de columna */}
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        {/* Cuerpo de la tabla */}
        <tbody>
          {/* Itera sobre cada fila de datos */}
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex} // Usa row.id si existe, sino el índice
              className={`border-b h-10 hover:bg-stone-100 ${rowClassName}`}
            >
              {/* Renderiza cada celda de la fila actual */}
              {columns.map((column) => (
                <td key={`${rowIndex}-${column.key}`}>
                  {/* Condicional: si existe render personalizado, lo usa; sino muestra el valor directo */}
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
