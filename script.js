const STORAGE_KEY = 'plancha02-content-v1';
const CONTENT_FILE = 'data/content.json';
const ADMIN_SESSION_KEY = 'plancha02-admin-auth';
const ADMIN_DEFAULT_USER = 'administrador';
const ADMIN_DEFAULT_PASS = 'campañaAcademico2026';

const defaultData = {
  campaignName: 'Liderazgo y Conocimiento · Plancha 02',
  campaignSlogan:
    'Somos una plancha estudiantil para el Consejo Académico de la Universidad de Manizales que propone decisiones con transparencia, participación real y resultados medibles para toda la comunidad universitaria.',
  campaignLogo: 'media/uploads/logo-plancha-02.jpg',
  candidates: [
    {
      name: 'Nombre Candidato 1',
      role: 'Principal',
      bio: 'Lidera procesos de representación estudiantil y promoción del bienestar universitario.',
      photo: 'media/uploads/candidato-1.jpg',
    },
    {
      name: 'Nombre Candidato 2',
      role: 'Suplente',
      bio: 'Enfocado en fortalecer la calidad académica y el diálogo entre facultades.',
      photo: 'media/uploads/candidato-2.jpg',
    },
    {
      name: 'Nombre Candidato 3',
      role: 'Principal',
      bio: 'Impulsa propuestas de innovación educativa, investigación y apoyo estudiantil.',
      photo: 'media/uploads/candidato-3.jpg',
    },
    {
      name: 'Nombre Candidato 4',
      role: 'Suplente',
      bio: 'Trabaja por una universidad inclusiva, sostenible y con más oportunidades.',
      photo: 'media/uploads/candidato-4.jpg',
    },
  ],
  proposals: [
    'Asambleas mensuales abiertas por facultad con actas públicas y seguimiento de avances.',
    'Plan de acompañamiento académico y psicosocial para prevenir deserción y rezago.',
    'Agenda semestral de bienestar universitario (salud mental, deporte, cultura y permanencia).',
    'Portal de transparencia académica con cronograma y estado de decisiones del Consejo.',
    'Fortalecimiento de semilleros, monitorías y convocatorias de movilidad e investigación.',
  ],
  governmentPlan:
    'Eje 1 · Participación: mesas de diálogo por programa y rendición de cuentas periódica.\nEje 2 · Calidad: propuestas para actualización curricular, evaluación justa y apoyo a prácticas.\nEje 3 · Bienestar: acciones concretas en salud mental, permanencia y apoyo socioeconómico.\nEje 4 · Innovación: digitalización de trámites académicos y mejor comunicación institucional.\nEje 5 · Seguimiento: indicadores trimestrales para medir cumplimiento del plan de gobierno.',
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

const loadEditableData = async () => {
  const base = await loadBaseData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? mergeData(base, JSON.parse(raw)) : base;
  } catch {
    return base;
  }
};

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

    const data = await loadEditableData();
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
          `media/uploads/candidato-${index + 1}.jpg`,
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
  loadEditableData().then((data) => {
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
