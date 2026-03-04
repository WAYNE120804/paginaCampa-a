const STORAGE_KEY = 'plancha02-content-v1';
const ADMIN_SESSION_KEY = 'plancha02-admin-auth';
const ADMIN_DEFAULT_USER = 'administrador';
const ADMIN_DEFAULT_PASS = 'campañaAcademico2026';

const defaultData = {
  campaignName: 'Liderazgo y Conocimiento · Plancha 02',
  campaignSlogan:
    'Proponemos un Consejo Académico más cercano al estudiante: participativo, innovador y con resultados reales para toda la comunidad universitaria.',
  campaignLogo: 'media/uploads/logo-placeholder.svg',
  candidates: [
    {
      name: 'Candidato 1',
      role: 'Principal',
      bio: 'Lidera procesos de representación estudiantil y promoción del bienestar universitario.',
      photo: 'media/uploads/candidato-1.svg',
    },
    {
      name: 'Candidato 2',
      role: 'Suplente',
      bio: 'Enfocado en fortalecer la calidad académica y el diálogo entre facultades.',
      photo: 'media/uploads/candidato-2.svg',
    },
    {
      name: 'Candidato 3',
      role: 'Principal',
      bio: 'Impulsa propuestas de innovación educativa, investigación y apoyo estudiantil.',
      photo: 'media/uploads/candidato-3.svg',
    },
    {
      name: 'Candidato 4',
      role: 'Suplente',
      bio: 'Trabaja por una universidad inclusiva, sostenible y con más oportunidades.',
      photo: 'media/uploads/candidato-4.svg',
    },
  ],
  proposals: [
    'Mesa mensual abierta con estudiantes para seguimiento de compromisos.',
    'Ruta de acompañamiento académico y mental para prevenir deserción.',
    'Fortalecimiento de semilleros de investigación y movilidad académica.',
    'Digitalización de trámites académicos y mayor transparencia en decisiones.',
  ],
  governmentPlan:
    '1) Participación activa: abrir canales permanentes de consulta y rendición de cuentas.\n2) Calidad académica: defender mejoras curriculares y apoyo a docentes y estudiantes.\n3) Bienestar integral: priorizar salud mental, cultura y deporte como ejes del éxito académico.\n4) Innovación institucional: promover herramientas tecnológicas y procesos ágiles.',
};

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData;
  } catch {
    return defaultData;
  }
};

const saveData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const isAdminPage = document.body.classList.contains('admin-page');

if (isAdminPage) {
  const loginSection = document.getElementById('loginSection');
  const adminSection = document.getElementById('adminSection');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  const setAdminVisibility = (isAuthenticated) => {
    loginSection.classList.toggle('hidden', isAuthenticated);
    adminSection.classList.toggle('hidden', !isAuthenticated);
  };

  const isAuthenticated = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'ok';
  setAdminVisibility(isAuthenticated);

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    if (username === ADMIN_DEFAULT_USER && password === ADMIN_DEFAULT_PASS) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'ok');
      loginError.textContent = '';
      setAdminVisibility(true);
      return;
    }

    loginError.textContent = 'Credenciales incorrectas. Inténtalo de nuevo.';
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminVisibility(false);
    loginForm.reset();
  });

  if (!isAuthenticated) {
    return;
  }

  const data = loadData();
  const form = document.getElementById('adminForm');
  const candidateFields = document.getElementById('candidateFields');

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
          <small class="helper-text">Selecciona la imagen para autocompletar la ruta. Guarda el archivo en <strong>media/uploads/</strong>.</small>
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

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const current = {
      campaignName: document.getElementById('campaignNameInput').value.trim(),
      campaignSlogan: document.getElementById('campaignSloganInput').value.trim(),
      campaignLogo: document.getElementById('campaignLogoInput').value.trim() || defaultData.campaignLogo,
      candidates: data.candidates.map((_, index) => ({
        name: form.querySelector(`[data-field="name"][data-index="${index}"]`).value.trim(),
        role: form.querySelector(`[data-field="role"][data-index="${index}"]`).value.trim(),
        bio: form.querySelector(`[data-field="bio"][data-index="${index}"]`).value.trim(),
        photo:
          form.querySelector(`[data-field="photo"][data-index="${index}"]`).value.trim() ||
          `media/uploads/candidato-${index + 1}.svg`,
      })),
      proposals: document
        .getElementById('proposalsInput')
        .value.split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      governmentPlan: document.getElementById('governmentPlanInput').value.trim(),
    };

    saveData(current);
    alert('✅ Cambios guardados. Recuerda guardar físicamente las imágenes en media/uploads/.');
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
} else {
  const data = loadData();

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
