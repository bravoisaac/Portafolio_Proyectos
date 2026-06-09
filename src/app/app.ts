import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Level = 'Basico' | 'Intermedio' | 'Avanzado';

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
    category: 'Logica',
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
    category: 'Asincronia',
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
  filter: Level | 'Todas' = 'Todas';
  levels: Array<Level | 'Todas'> = ['Todas', 'Basico', 'Intermedio', 'Avanzado'];
  output = 'La salida aparecera aqui.';
  workingCode = '';

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
    return this.tests.filter((test) => this.filter === 'Todas' || test.level === this.filter);
  }

  selectTest(id: string): void {
    const test = this.tests.find((item) => item.id === id) ?? this.tests[0];
    if (!test) return;

    this.selectedId = test.id;
    this.workingCode = test.code;
    this.output = 'La salida aparecera aqui.';
  }

  setFilter(filter: Level | 'Todas'): void {
    this.filter = filter;
    const firstVisible = this.visibleTests[0];
    if (firstVisible) this.selectTest(firstVisible.id);
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
    this.selectTest(test.id);
    document.querySelector('#editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  clearCustomTests(): void {
    localStorage.setItem(STORAGE_KEY, '[]');
    this.tests = [...seedTests];
    this.filter = 'Todas';
    this.selectTest(this.tests[0].id);
  }

  runCode(): void {
    this.output = 'Ejecutando...';

    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const timeout = window.setTimeout(() => {
      this.zone.run(() => {
        this.output = 'Tiempo agotado. Revisa bucles infinitos o promesas que no terminan.';
        this.changeDetector.detectChanges();
      });
      window.removeEventListener('message', handleMessage);
      iframe.remove();
    }, 3000);

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
          .then(() => {
            const userCode = ${JSON.stringify(this.workingCode)};
            const result = Function('"use strict";\\n' + userCode)();
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
