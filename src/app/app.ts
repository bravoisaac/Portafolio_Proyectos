import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Level = 'Basico' | 'Intermedio' | 'Avanzado';
type Category =
  | 'JavaScript'
  | 'Python'
  | 'SQL'
  | 'Angular'
  | 'React'
  | 'Backend'
  | 'Frontend'
  | 'APIs'
  | 'Testing'
  | 'Logica'
  | 'Asincronia';

interface TheoryTest {
  id: string;
  title: string;
  category: string;
  level: Level;
  time: string;
  language: string;
  description: string;
  prompt: string;
  code: string;
}

interface TestForm {
  title: string;
  category: string;
  level: Level;
  time: string;
  description: string;
  prompt: string;
  code: string;
}

const STORAGE_KEY = 'junio-codelab-tests';
const PAGE_SIZE = 6;
const CATEGORY_OPTIONS: Category[] = [
  'JavaScript',
  'Python',
  'SQL',
  'Angular',
  'React',
  'Backend',
  'Frontend',
  'APIs',
  'Testing',
  'Logica',
  'Asincronia',
];

const seedTests: TheoryTest[] = [
  {
    id: 'seed-closures',
    title: 'Closures y memoria',
    category: 'JavaScript',
    level: 'Intermedio',
    time: '25 min',
    language: 'JavaScript',
    description:
      'Evalua si la persona entiende alcance lexico, encapsulacion de estado y funciones que recuerdan valores despues de ejecutarse.',
    prompt:
      'Crea una funcion crearContador(inicial) que retorne un objeto con los metodos incrementar(), decrementar() y valor(). El estado no debe estar disponible como propiedad publica.',
    code: `function crearContador(inicial = 0) {
  let actual = inicial;

  return {
    incrementar() {
      actual += 1;
      return actual;
    },
    decrementar() {
      actual -= 1;
      return actual;
    },
    valor() {
      return actual;
    }
  };
}

const contador = crearContador(10);
console.log(contador.incrementar());
console.log(contador.decrementar());
console.log(contador.valor());`,
  },
  {
    id: 'seed-arrays',
    title: 'Transformacion de datos',
    category: 'JavaScript',
    level: 'Basico',
    time: '18 min',
    language: 'JavaScript',
    description:
      'Mide criterio para recorrer colecciones, agrupar informacion y devolver una estructura facil de consumir.',
    prompt:
      'Recibe una lista de postulaciones con empresa y estado. Devuelve un resumen con la cantidad por estado y una lista unica de empresas.',
    code: `const postulaciones = [
  { empresa: "Norte Labs", estado: "enviada" },
  { empresa: "Andes AI", estado: "entrevista" },
  { empresa: "Norte Labs", estado: "rechazada" },
  { empresa: "Pixel Forge", estado: "enviada" }
];

function resumirPostulaciones(items) {
  return items.reduce(
    (resumen, item) => {
      resumen.estados[item.estado] = (resumen.estados[item.estado] || 0) + 1;
      if (!resumen.empresas.includes(item.empresa)) {
        resumen.empresas.push(item.empresa);
      }
      return resumen;
    },
    { estados: {}, empresas: [] }
  );
}

console.log(JSON.stringify(resumirPostulaciones(postulaciones), null, 2));`,
  },
  {
    id: 'seed-async',
    title: 'Promesas y control de errores',
    category: 'Backend',
    level: 'Avanzado',
    time: '35 min',
    language: 'JavaScript',
    description:
      'Permite mostrar experiencia evaluando asincronia, manejo de errores y normalizacion de respuestas.',
    prompt:
      'Simula tres consultas asincronas. Debes devolver solo las respuestas exitosas y registrar los errores sin detener todo el flujo.',
    code: `const consultas = [
  () => Promise.resolve({ id: 1, score: 92 }),
  () => Promise.reject(new Error("Servicio no disponible")),
  () => Promise.resolve({ id: 3, score: 77 })
];

async function ejecutarConsultas(tareas) {
  const resultados = await Promise.allSettled(tareas.map((tarea) => tarea()));

  return resultados.reduce((salida, resultado) => {
    if (resultado.status === "fulfilled") {
      salida.exitos.push(resultado.value);
    } else {
      salida.errores.push(resultado.reason.message);
    }
    return salida;
  }, { exitos: [], errores: [] });
}

ejecutarConsultas(consultas).then((salida) => {
  console.log(JSON.stringify(salida, null, 2));
});`,
  },
  {
    id: 'seed-python',
    title: 'Python: estructuras de datos',
    category: 'Python',
    level: 'Basico',
    time: '20 min',
    language: 'JavaScript runner',
    description:
      'Evalua conceptos equivalentes a listas, diccionarios, conteo de valores y limpieza de datos antes de escribir la respuesta en Python.',
    prompt:
      'Dada una lista de lenguajes, cuenta cuantas veces aparece cada lenguaje. En una entrevista puedes pedir la solucion en Python con dict o Counter.',
    code: `const lenguajes = ["python", "sql", "python", "javascript", "python", "sql"];

function contar(items) {
  return items.reduce((conteo, item) => {
    conteo[item] = (conteo[item] || 0) + 1;
    return conteo;
  }, {});
}

console.log(JSON.stringify(contar(lenguajes), null, 2));`,
  },
  {
    id: 'seed-sql',
    title: 'SQL: agrupacion y filtros',
    category: 'SQL',
    level: 'Intermedio',
    time: '25 min',
    language: 'JavaScript runner',
    description:
      'Permite explicar SELECT, WHERE, GROUP BY y ORDER BY usando datos simulados dentro del navegador.',
    prompt:
      'Obtén el total de postulaciones por estado, ignorando registros archivados. En SQL seria una consulta con WHERE, GROUP BY y COUNT.',
    code: `const postulaciones = [
  { estado: "enviada", archivada: false },
  { estado: "entrevista", archivada: false },
  { estado: "enviada", archivada: false },
  { estado: "rechazada", archivada: true },
  { estado: "entrevista", archivada: false }
];

const resumen = postulaciones
  .filter((item) => !item.archivada)
  .reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] || 0) + 1;
    return acc;
  }, {});

console.log(JSON.stringify(resumen, null, 2));`,
  },
  {
    id: 'seed-frontend',
    title: 'Frontend: estado de UI',
    category: 'Frontend',
    level: 'Intermedio',
    time: '30 min',
    language: 'JavaScript',
    description:
      'Evalua manejo de estado, eventos y actualizacion de vistas sin duplicar logica entre componentes.',
    prompt:
      'Crea una funcion toggleSeleccion que agregue o quite un id de una lista de seleccionados sin mutar el arreglo original.',
    code: `function toggleSeleccion(seleccionados, id) {
  if (seleccionados.includes(id)) {
    return seleccionados.filter((item) => item !== id);
  }

  return [...seleccionados, id];
}

const estado1 = toggleSeleccion([1, 2], 3);
const estado2 = toggleSeleccion(estado1, 2);

console.log(JSON.stringify({ estado1, estado2 }, null, 2));`,
  },
  {
    id: 'seed-api',
    title: 'APIs: normalizar respuesta',
    category: 'APIs',
    level: 'Avanzado',
    time: '35 min',
    language: 'JavaScript',
    description:
      'Sirve para mostrar criterio de integracion backend/frontend: validacion, normalizacion y respuestas estables.',
    prompt:
      'Recibe una respuesta de API con campos opcionales y devuelve un DTO consistente para pintar una tarjeta de candidato.',
    code: `const apiResponse = {
  id: 42,
  profile: { name: "Isaac", stack: ["Angular", "Node"] },
  stats: null
};

function normalizarCandidato(data) {
  return {
    id: data.id,
    nombre: data.profile?.name ?? "Sin nombre",
    stack: data.profile?.stack ?? [],
    postulaciones: data.stats?.applications ?? 0
  };
}

console.log(JSON.stringify(normalizarCandidato(apiResponse), null, 2));`,
  },
  {
    id: 'seed-python-create-api',
    title: 'Python: crear API con PokeAPI',
    category: 'Python',
    level: 'Avanzado',
    time: '40 min',
    language: 'JavaScript runner',
    description:
      'Evalua si la persona puede disenar un endpoint estilo FastAPI que reciba id o nombre, consuma PokeAPI y devuelva una respuesta limpia.',
    prompt:
      'Crea en Python un endpoint GET /pokemon/{id_o_nombre}. Debe llamar a https://pokeapi.co/api/v2/pokemon/{id o nombre}, manejar 404 y devolver id, nombre, altura, peso, tipos y habilidades.',
    code: `const idONombre = "pikachu";
const endpoint = "https://pokeapi.co/api/v2/pokemon/" + idONombre.toLowerCase();
const fallbackPokemon = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  types: [{ type: { name: "electric" } }],
  abilities: [
    { ability: { name: "static" } },
    { ability: { name: "lightning-rod" } }
  ]
};

async function obtenerPokemonParaApi(url) {
  let pokemon;
  let fuente = "PokeAPI";

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      return {
        status: 404,
        error: "Pokemon no encontrado"
      };
    }

    if (!response.ok) {
      throw new Error("Error consultando PokeAPI: " + response.status);
    }

    pokemon = await response.json();
  } catch (error) {
    fuente = "fallback local";
    pokemon = fallbackPokemon;
  }

  return {
    status: 200,
    fuente,
    data: {
      id: pokemon.id,
      nombre: pokemon.name,
      altura: pokemon.height,
      peso: pokemon.weight,
      tipos: pokemon.types.map((item) => item.type.name),
      habilidades: pokemon.abilities.map((item) => item.ability.name)
    }
  };
}

const resultado = await obtenerPokemonParaApi(endpoint);
console.log(JSON.stringify(resultado, null, 2));`,
  },
  {
    id: 'seed-angular-consume-api',
    title: 'Angular: consumir PokeAPI',
    category: 'Angular',
    level: 'Intermedio',
    time: '35 min',
    language: 'JavaScript runner',
    description:
      'Mide conocimiento de servicios Angular, estados de carga, manejo de errores y transformacion de la respuesta de PokeAPI.',
    prompt:
      'Crea un servicio Angular con HttpClient para consultar https://pokeapi.co/api/v2/pokemon/{id o nombre}. El componente debe buscar por nombre/id, mostrar loading, error y una tarjeta con nombre, imagen, tipos y habilidades.',
    code: `const busqueda = "charizard";
const fallbackPokemon = {
  id: 6,
  name: "charizard",
  sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
  types: [{ type: { name: "fire" } }, { type: { name: "flying" } }],
  abilities: [{ ability: { name: "blaze" } }, { ability: { name: "solar-power" } }]
};

async function cargarPokemonAngular(nombreOId) {
  const estado = { cargando: true, error: null, pokemon: null, fuente: "PokeAPI" };
  let data;

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + nombreOId.toLowerCase());

    if (!response.ok) {
      throw new Error(response.status === 404 ? "Pokemon no encontrado" : "Error de API");
    }

    data = await response.json();
  } catch (error) {
    estado.fuente = "fallback local";
    data = fallbackPokemon;
  } finally {
    estado.cargando = false;
  }

  estado.pokemon = {
    id: data.id,
    nombre: data.name,
    imagen: data.sprites.front_default,
    tipos: data.types.map((item) => item.type.name),
    habilidades: data.abilities.map((item) => item.ability.name)
  };

  return estado;
}

const estado = await cargarPokemonAngular(busqueda);
console.log(JSON.stringify(estado, null, 2));`,
  },
  {
    id: 'seed-react-consume-api',
    title: 'React: consumir PokeAPI',
    category: 'React',
    level: 'Intermedio',
    time: '35 min',
    language: 'JavaScript runner',
    description:
      'Evalua consumo de APIs en React: useEffect, estado, errores, normalizacion y renderizado condicional usando PokeAPI.',
    prompt:
      'Crea un componente React que tenga un input de busqueda, consulte https://pokeapi.co/api/v2/pokemon/{id o nombre}, muestre loading/error y renderice nombre, sprite, tipos y stats base.',
    code: `const nombreOId = "25";
const fallbackPokemon = {
  id: 25,
  name: "pikachu",
  sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
  types: [{ type: { name: "electric" } }],
  stats: [
    { base_stat: 35, stat: { name: "hp" } },
    { base_stat: 55, stat: { name: "attack" } },
    { base_stat: 90, stat: { name: "speed" } }
  ]
};

async function usePokemonSimulado(valorBusqueda) {
  const state = { loading: true, error: null, pokemon: null, fuente: "PokeAPI" };
  let data;

  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + String(valorBusqueda).toLowerCase());

    if (!response.ok) {
      throw new Error(response.status === 404 ? "Pokemon no encontrado" : "No se pudo cargar");
    }

    data = await response.json();
  } catch (error) {
    state.fuente = "fallback local";
    data = fallbackPokemon;
  } finally {
    state.loading = false;
  }

  state.pokemon = {
    id: data.id,
    nombre: data.name,
    sprite: data.sprites.front_default,
    tipos: data.types.map((item) => item.type.name),
    stats: data.stats.map((item) => ({
      nombre: item.stat.name,
      base: item.base_stat
    }))
  };

  return state;
}

const state = await usePokemonSimulado(nombreOId);
console.log(JSON.stringify(state, null, 2));`,
  },
  {
    id: 'seed-testing-unit',
    title: 'Testing: casos unitarios',
    category: 'Testing',
    level: 'Intermedio',
    time: '25 min',
    language: 'JavaScript',
    description:
      'Evalua si la persona sabe definir casos felices, bordes y errores sin depender de una UI o de servicios externos.',
    prompt:
      'Crea pruebas unitarias para una funcion que calcula descuento. Debe validar monto positivo, porcentaje entre 0 y 100, y resultado final.',
    code: `function aplicarDescuento(monto, porcentaje) {
  if (monto < 0) throw new Error("El monto no puede ser negativo");
  if (porcentaje < 0 || porcentaje > 100) throw new Error("Porcentaje invalido");

  return monto - monto * (porcentaje / 100);
}

const casos = [
  { nombre: "descuento normal", actual: aplicarDescuento(100, 20), esperado: 80 },
  { nombre: "sin descuento", actual: aplicarDescuento(100, 0), esperado: 100 },
  { nombre: "descuento total", actual: aplicarDescuento(100, 100), esperado: 0 }
];

const resultados = casos.map((caso) => ({
  nombre: caso.nombre,
  pasa: caso.actual === caso.esperado
}));

console.log(JSON.stringify(resultados, null, 2));`,
  },
  {
    id: 'seed-logica-validation',
    title: 'Logica: validar reglas',
    category: 'Logica',
    level: 'Basico',
    time: '20 min',
    language: 'JavaScript',
    description:
      'Evalua pensamiento logico, reglas condicionales y devolucion de errores claros para una entrada de usuario.',
    prompt:
      'Valida una postulacion: debe tener nombre, email valido, al menos una tecnologia y anios de experiencia mayor o igual a 0.',
    code: `const postulacion = {
  nombre: "Isaac",
  email: "isaac@email.com",
  tecnologias: ["Angular", "Python"],
  aniosExperiencia: 2
};

function validarPostulacion(data) {
  const errores = [];

  if (!data.nombre) errores.push("Falta nombre");
  if (!/^\\S+@\\S+\\.\\S+$/.test(data.email || "")) errores.push("Email invalido");
  if (!Array.isArray(data.tecnologias) || data.tecnologias.length === 0) {
    errores.push("Debe agregar tecnologias");
  }
  if (data.aniosExperiencia < 0) errores.push("Experiencia invalida");

  return {
    valida: errores.length === 0,
    errores
  };
}

console.log(JSON.stringify(validarPostulacion(postulacion), null, 2));`,
  },
  {
    id: 'seed-asincronia-retry',
    title: 'Asincronia: reintentos',
    category: 'Asincronia',
    level: 'Avanzado',
    time: '35 min',
    language: 'JavaScript',
    description:
      'Evalua promesas, await, control de errores y reintentos controlados cuando una operacion remota falla.',
    prompt:
      'Crea una funcion ejecutarConReintentos que intente una tarea asincrona hasta 3 veces y devuelva el resultado o el ultimo error.',
    code: `let intentos = 0;

async function tareaInestable() {
  intentos += 1;

  if (intentos < 3) {
    throw new Error("Fallo temporal en intento " + intentos);
  }

  return "Tarea completada en intento " + intentos;
}

async function ejecutarConReintentos(tarea, maxIntentos) {
  let ultimoError;

  for (let intento = 1; intento <= maxIntentos; intento += 1) {
    try {
      return await tarea();
    } catch (error) {
      ultimoError = error;
      console.log("Reintentando:", error.message);
    }
  }

  throw ultimoError;
}

const resultado = await ejecutarConReintentos(tareaInestable, 3);
console.log(resultado);`,
  },
];

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  tests: TheoryTest[] = [];
  selectedId = '';
  levelFilter: Level | 'Todas' = 'Todas';
  categoryFilter: Category | 'Todas' = 'Todas';
  levels: Array<Level | 'Todas'> = ['Todas', 'Basico', 'Intermedio', 'Avanzado'];
  categories: Array<Category | 'Todas'> = ['Todas', ...CATEGORY_OPTIONS];
  categoryOptions = CATEGORY_OPTIONS;
  output = 'La salida aparecera aqui.';
  workingCode = '';
  currentPage = 1;
  readonly pageSize = PAGE_SIZE;

  form: TestForm = this.emptyForm();

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly zone: NgZone,
  ) {
    this.loadTests();
    this.selectTest(this.tests[0]?.id ?? '');
  }

  get selectedTest(): TheoryTest {
    return this.tests.find((test) => test.id === this.selectedId) ?? this.tests[0];
  }

  get visibleTests(): TheoryTest[] {
    return this.tests.filter((test) => {
      const matchesLevel = this.levelFilter === 'Todas' || test.level === this.levelFilter;
      const matchesCategory = this.categoryFilter === 'Todas' || test.category === this.categoryFilter;
      return matchesLevel && matchesCategory;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.visibleTests.length / this.pageSize));
  }

  get paginatedTests(): TheoryTest[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.visibleTests.slice(start, start + this.pageSize);
  }

  get paginationStart(): number {
    if (!this.visibleTests.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.visibleTests.length);
  }

  selectTest(id: string): void {
    const test = this.tests.find((item) => item.id === id) ?? this.tests[0];
    if (!test) return;

    this.selectedId = test.id;
    this.workingCode = test.code;
    this.output = 'La salida aparecera aqui.';
  }

  setLevelFilter(filter: Level | 'Todas'): void {
    this.levelFilter = filter;
    this.currentPage = 1;
    this.selectFirstVisibleTest();
  }

  setCategoryFilter(filter: Category | 'Todas'): void {
    this.categoryFilter = filter;
    this.currentPage = 1;
    this.selectFirstVisibleTest();
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
    const firstOnPage = this.paginatedTests[0];
    if (firstOnPage) this.selectTest(firstOnPage.id);
  }

  selectFirstVisibleTest(): void {
    const firstVisible = this.visibleTests[0];
    if (firstVisible) {
      this.selectTest(firstVisible.id);
      return;
    }

    this.selectedId = '';
    this.workingCode = '';
    this.output = 'No hay pruebas para esta combinacion de filtros.';
  }

  resetCode(): void {
    this.workingCode = this.selectedTest.code;
    this.output = 'Codigo reiniciado.';
  }

  addTest(): void {
    const test: TheoryTest = {
      id: `custom-${Date.now()}`,
      title: this.form.title.trim(),
      category: this.form.category.trim(),
      level: this.form.level,
      time: this.form.time.trim(),
      language: 'JavaScript',
      description: this.form.description.trim(),
      prompt: this.form.prompt.trim(),
      code: this.form.code,
    };

    this.tests = [...this.tests, test];
    this.saveCustomTests();
    this.form = this.emptyForm();
    this.levelFilter = test.level;
    this.categoryFilter = test.category as Category;
    const newIndex = this.visibleTests.findIndex((item) => item.id === test.id);
    this.currentPage = newIndex >= 0 ? Math.ceil((newIndex + 1) / this.pageSize) : 1;
    this.selectTest(test.id);
    document.querySelector('#editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  clearCustomTests(): void {
    localStorage.setItem(STORAGE_KEY, '[]');
    this.tests = [...seedTests];
    this.levelFilter = 'Todas';
    this.categoryFilter = 'Todas';
    this.currentPage = 1;
    this.selectTest(this.tests[0].id);
  }

  runCode(): void {
    this.output = 'Ejecutando...';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const timeout = window.setTimeout(() => {
      this.zone.run(() => {
        this.output = 'Tiempo agotado. Revisa bucles infinitos o promesas que no terminan.';
        this.changeDetector.detectChanges();
      });
      window.removeEventListener('message', handleMessage);
      iframe.remove();
    }, 8000);

    const handleMessage = (event: MessageEvent<{ output?: string }>) => {
      if (event.source !== iframe.contentWindow) return;
      window.clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      this.zone.run(() => {
        this.output = event.data.output || 'Sin salida. Usa console.log para mostrar resultados.';
        this.changeDetector.detectChanges();
      });
      iframe.remove();
    };

    window.addEventListener('message', handleMessage);

    iframe.srcdoc = `
      <script>
        const logs = [];
        const print = (values) => {
          logs.push(values.map((value) => {
            if (value instanceof Error) return value.stack || value.message;
            if (typeof value === "object") {
              try { return JSON.stringify(value, null, 2); } catch { return String(value); }
            }
            return String(value);
          }).join(" "));
        };

        console.log = (...values) => print(values);
        console.warn = (...values) => print(values);
        console.error = (...values) => print(values);

        Promise.resolve()
          .then(async () => {
            const userCode = ${JSON.stringify(this.workingCode)};
            const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
            const result = await AsyncFunction('"use strict";\\n' + userCode)();
            if (result !== undefined) console.log(result);
          })
          .then(() => parent.postMessage({ output: logs.join("\\n") }, "*"))
          .catch((error) => parent.postMessage({ output: error.stack || error.message }, "*"));
      <\/script>
    `;
  }

  scrollToCreator(): void {
    document.querySelector('#creator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private loadTests(): void {
    this.tests = [...seedTests, ...this.getCustomTests()];
  }

  private getCustomTests(): TheoryTest[] {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  private saveCustomTests(): void {
    const customTests = this.tests.filter((test) => !test.id.startsWith('seed-'));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customTests));
  }

  private emptyForm(): TestForm {
    return {
      title: '',
      category: 'JavaScript',
      level: 'Intermedio',
      time: '25 min',
      description: '',
      prompt: '',
      code: `function resolver() {
  return "junio";
}

console.log(resolver());`,
    };
  }
}
