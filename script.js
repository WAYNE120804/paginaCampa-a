const STORAGE_KEY = 'plancha02-content-v1';
const CONTENT_FILE = 'data/content.json';
const ADMIN_SESSION_KEY = 'plancha02-admin-auth';
const ADMIN_DEFAULT_USER = 'administrador';
const ADMIN_DEFAULT_PASS = 'campañaAcademico2026';

const defaultData = {
  campaignName: 'Fuerza Académica · Plancha 02',
  campaignSlogan:
    'Proponemos un Consejo Académico que se construya a partir de tres principios fundamentales: innovar, prevenir y escuchar. Queremos una universidad que sea capaz de anticipar los desafíos académicos personales y generales, promover nuevas formas de aprendizaje, investigación y procesos fortaleciendo los espacios de participación estudiantil dentro de la comunidad universitaria. Nuestro objetivo es impulsar una gestión académica más cercana, moderna y participativa, que contribuya al fortalecimiento de la calidad educativa y a una mejor experiencia universitaria para todos.',
  campaignLogo: 'media/uploads/logo.jpeg',
  candidates: [
    {
      name: 'Héctor Fabio Rivera Castaño',
      role: 'Principal',
      bio: 'Es estudiante de Derecho y actual edil de la Comuna San José. Se ha formado en el análisis jurídico y en el servicio a la comunidad. Aspira al Consejo Académico para fortalecer la voz estudiantil. Quiere impulsar mejoras reales para la modalidad virtual. Representar es escuchar, estructurar y transformar.',
      photo: 'media/uploads/hector_rivera.jpeg',
    },
    {
      name: 'Edna Juliana Zapata Ocampo',
      role: 'Principal',
      bio: 'Ella es Juliana Zapata, estudiante de Psicología. Es una mujer que cree que siempre es un buen momento para empezar, una persona que confía en la justicia, la disciplina y el amor. Es una mamá enamorada de la vida, de sus dos hijos y de la academia. Le encantan los libros, la conecta escribir y sobre todo le apasiona aprender.',
      photo: 'media/uploads/julian_zapata.jpeg',
    },
    {
      name: 'Juan Miguel Gómez Molina',
      role: 'Suplente',
      bio: 'Es estudiante de Ingeniería de Sistemas. Disfruta viajar, el billar, estar con sus amigos y los videojuegos. Cree firmemente que cada persona tiene una perspectiva distinta de la cual se puede aprender. Es alguien con mucha energía y creatividad, y siempre está dispuesto a ayudar a los demás.',
      photo: 'media/uploads/miguel_gomez.jpeg',
    },
    {
      name: 'Jesus David Castro Piedra',
      role: 'Suplente',
      bio: 'Es estudiante de Medicina. Disfruta el voleibol y los videojuegos. Es una persona que le pone el alma a lo que hace, convencido de que hay que divertirse haciendo lo que nos apasiona. Sus habilidades como líder las ha construido a lo largo de los años y lo acompañan donde va. Le gusta trabajar siempre en pro del bienestar de los demás y asegurarse de que todos estén bien.',
      photo: 'media/uploads/david_piedra.jpeg',
    },
  ],
  proposals: [
    'Sistema de Alertas Académicas Tempranas: Crear un sistema que identifique estudiantes en riesgo académico mediante indicadores como inasistencias y bajo rendimiento, activando alertas, tutorías preventivas y acompañamiento para reducir la deserción.',
    'Banco de Electivas Abiertas y Actualización Curricular: Modernizar los planes de estudio mediante una comisión académica que promueva electivas entre facultades, cursos intersemestrales y formación en áreas emergentes como inteligencia artificial y habilidades para la vida.',
    'Observatorio Académico Estudiantil: Crear un observatorio que analice datos académicos, identifique problemáticas estructurales y emita informes y recomendaciones para mejorar la toma de decisiones en la universidad.',
    'Semillero 2.0: Fortalecer los semilleros de investigación con articulación entre facultades, créditos académicos, incentivos, publicaciones estudiantiles y convocatorias de proyectos interdisciplinarios.',
    'Una Nueva Forma de Evaluar: Actualizar los sistemas de evaluación de estudiantes y docentes mediante mejores instrumentos, mayor retroalimentación y enfoques formativos que mejoren el aprendizaje.',
    'Internacionalización Académica Real: Promover la internacionalización a través de clases espejo, proyectos virtuales con universidades extranjeras y seminarios internacionales accesibles para más estudiantes.',
    'Exaltación de Habilidades por Facultades: Implementar un sistema institucional que reconozca la innovación, la investigación y el impacto social de los proyectos estudiantiles, promoviendo la cultura de excelencia académica.',
    'Potenciando la Forma de Conectarnos: Crear nuevos espacios de comunicación y retroalimentación entre estudiantes y autoridades académicas, incluyendo escenarios presenciales y virtuales.',
    'Validar Experticia en los Últimos Semestres: Permitir que experiencias laborales o prácticas en los últimos semestres puedan ser validadas académicamente con la supervisión de un docente tutor.',
    'Talentos: Una Nueva Ruta: Crear un programa para estudiantes destacados que les permita adelantar materias, participar en investigación, ser monitores y cursar asignaturas de posgrado.',
  ],
  governmentPlan:
    'Este plan de gobierno académico busca consolidar una universidad más preventiva, innovadora y participativa, capaz de responder a los desafíos actuales de la educación superior. A través de estas estrategias se pretende fortalecer la calidad educativa, mejorar la permanencia estudiantil y promover una cultura académica basada en la excelencia, la investigación y la colaboración.',
};

const saveData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const mergeData = (base, override) => ({ ...base, ...override });

const loadBaseData = async () => {
  try {
    const res = await fetch(CONTENT_FILE, { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo leer content.json');
    const json = await res.json();
    return mergeData(defaultData, json);
  } catch {
    return defaultData;
  }
};

const loadAdminEditableData = async () => {
  const base = await loadBaseData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? mergeData(base, JSON.parse(raw)) : base;
  } catch {
    return base;
  }
};

const loadPublicData = async () => loadBaseData();

const isAdminPage = document.body.classList.contains('admin-page');

const exportJsonForNetlify = (data) => JSON.stringify(data, null, 2);

if (isAdminPage) {
  const loginSection = document.getElementById('loginSection');
  const adminSection = document.getElementById('adminSection');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  let adminInitialized = false;

  const setAdminVisibility = (isAuthenticated) => {
    loginSection.classList.toggle('hidden', isAuthenticated);
    adminSection.classList.toggle('hidden', !isAuthenticated);
  };

  const initializeAdminPanel = async () => {
    if (adminInitialized) return;
    adminInitialized = true;

    const data = await loadAdminEditableData();
    const form = document.getElementById('adminForm');
    const candidateFields = document.getElementById('candidateFields');
    const netlifyJsonOutput = document.getElementById('netlifyJsonOutput');

    document.getElementById('campaignNameInput').value = data.campaignName;
    document.getElementById('campaignSloganInput').value = data.campaignSlogan;
    document.getElementById('campaignLogoInput').value = data.campaignLogo;
    document.getElementById('proposalsInput').value = data.proposals.join('\n');
    document.getElementById('governmentPlanInput').value = data.governmentPlan;

    const logoFileInput = document.getElementById('campaignLogoFile');
    logoFileInput.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      document.getElementById('campaignLogoInput').value = `media/uploads/${file.name}`;
    });

    const renderCandidateInputs = (candidates) => {
      candidateFields.innerHTML = candidates
        .map(
          (candidate, index) => `
          <div class="candidate-box">
            <strong>Candidato ${index + 1}</strong>
            <label>Nombre <input type="text" data-field="name" data-index="${index}" value="${candidate.name}" required></label>
            <label>Cargo <input type="text" data-field="role" data-index="${index}" value="${candidate.role}" required></label>
            <label>Descripción <textarea data-field="bio" data-index="${index}" rows="3">${candidate.bio}</textarea></label>
            <label>Ruta local foto <input type="text" data-field="photo" data-index="${index}" value="${candidate.photo}"></label>
            <label>Seleccionar foto <input type="file" data-field="photoFile" data-index="${index}" accept="image/*"></label>
            <small class="helper-text">Selecciona la imagen para autocompletar ruta. Coloca el archivo físico en <strong>media/uploads/</strong>.</small>
          </div>
        `,
        )
        .join('');

      candidateFields.querySelectorAll('input[data-field="photoFile"]').forEach((input) => {
        input.addEventListener('change', (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const index = event.target.dataset.index;
          const target = form.querySelector(`[data-field="photo"][data-index="${index}"]`);
          target.value = `media/uploads/${file.name}`;
        });
      });
    };

    renderCandidateInputs(data.candidates);

    const collectFormData = () => ({
      campaignName: document.getElementById('campaignNameInput').value.trim(),
      campaignSlogan: document.getElementById('campaignSloganInput').value.trim(),
      campaignLogo: document.getElementById('campaignLogoInput').value.trim() || defaultData.campaignLogo,
      candidates: data.candidates.map((_, index) => ({
        name: form.querySelector(`[data-field="name"][data-index="${index}"]`).value.trim(),
        role: form.querySelector(`[data-field="role"][data-index="${index}"]`).value.trim(),
        bio: form.querySelector(`[data-field="bio"][data-index="${index}"]`).value.trim(),
        photo:
          form.querySelector(`[data-field="photo"][data-index="${index}"]`).value.trim() ||
          `media/uploads/candidato-${index + 1}.jpeg`,
      })),
      proposals: document
        .getElementById('proposalsInput')
        .value.split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      governmentPlan: document.getElementById('governmentPlanInput').value.trim(),
    });

    netlifyJsonOutput.value = exportJsonForNetlify(collectFormData());

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const current = collectFormData();
      saveData(current);
      netlifyJsonOutput.value = exportJsonForNetlify(current);
      alert('✅ Cambios guardados en este navegador. Para Netlify pega el JSON en data/content.json.');
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
      const current = collectFormData();
      netlifyJsonOutput.value = exportJsonForNetlify(current);
      netlifyJsonOutput.focus();
      netlifyJsonOutput.select();
    });

    document.getElementById('resetBtn').addEventListener('click', async () => {
      localStorage.removeItem(STORAGE_KEY);
      const baseData = await loadBaseData();
      saveData(baseData);
      location.reload();
    });
  };

  const isAuthenticated = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'ok';
  setAdminVisibility(isAuthenticated);

  if (isAuthenticated) {
    initializeAdminPanel();
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    if (username === ADMIN_DEFAULT_USER && password === ADMIN_DEFAULT_PASS) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'ok');
      loginError.textContent = '';
      setAdminVisibility(true);
      initializeAdminPanel();
      return;
    }

    loginError.textContent = 'Credenciales incorrectas. Inténtalo de nuevo.';
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminVisibility(false);
    loginForm.reset();
  });
} else {
  loadPublicData().then((data) => {
    document.getElementById('campaignName').textContent = data.campaignName;
    document.getElementById('campaignSlogan').textContent = data.campaignSlogan;
    document.getElementById('campaignLogo').src = data.campaignLogo;

    document.getElementById('candidatesGrid').innerHTML = data.candidates
      .map(
        (candidate) => `
      <article class="card">
        <img src="${candidate.photo}" alt="${candidate.name}">
        <div class="card-content">
          <h3>${candidate.name}</h3>
          <p><strong>${candidate.role}</strong></p>
          <p>${candidate.bio}</p>
        </div>
      </article>
    `,
      )
      .join('');

    document.getElementById('proposalsList').innerHTML = data.proposals.map((proposal) => `<li>${proposal}</li>`).join('');
    document.getElementById('governmentPlan').textContent = data.governmentPlan;
  });

  const targetDate = new Date('2026-03-13T08:00:00-05:00').getTime();
  const countdown = document.getElementById('countdown');

  const tick = () => {
    const diff = targetDate - Date.now();
    if (diff <= 0) {
      countdown.textContent = '¡Hoy es el día! Vota por Plancha 02.';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    countdown.textContent = `Faltan ${days} días, ${hours} horas y ${minutes} minutos`;
  };

  tick();
  setInterval(tick, 60000);
}
