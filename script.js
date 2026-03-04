const STORAGE_KEY = 'plancha02-content-v1';

const defaultData = {
  campaignName: 'Liderazgo y Conocimiento · Plancha 02',
  campaignSlogan:
    'Proponemos un Consejo Académico más cercano al estudiante: participativo, innovador y con resultados reales para toda la comunidad universitaria.',
  campaignLogo:
    'https://dummyimage.com/500x500/0c3b2e/f3ff5f&text=Sube+el+logo+de+Plancha+02',
  candidates: [
    {
      name: 'Candidato 1',
      role: 'Principal',
      bio: 'Lidera procesos de representación estudiantil y promoción del bienestar universitario.',
      photo: 'https://dummyimage.com/400x400/e9efe9/0c3b2e&text=Foto+1',
    },
    {
      name: 'Candidato 2',
      role: 'Suplente',
      bio: 'Enfocado en fortalecer la calidad académica y el diálogo entre facultades.',
      photo: 'https://dummyimage.com/400x400/e9efe9/0c3b2e&text=Foto+2',
    },
    {
      name: 'Candidato 3',
      role: 'Principal',
      bio: 'Impulsa propuestas de innovación educativa, investigación y apoyo estudiantil.',
      photo: 'https://dummyimage.com/400x400/e9efe9/0c3b2e&text=Foto+3',
    },
    {
      name: 'Candidato 4',
      role: 'Suplente',
      bio: 'Trabaja por una universidad inclusiva, sostenible y con más oportunidades.',
      photo: 'https://dummyimage.com/400x400/e9efe9/0c3b2e&text=Foto+4',
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
  const data = loadData();
  const form = document.getElementById('adminForm');
  const candidateFields = document.getElementById('candidateFields');

  document.getElementById('campaignNameInput').value = data.campaignName;
  document.getElementById('campaignSloganInput').value = data.campaignSlogan;
  document.getElementById('campaignLogoInput').value = data.campaignLogo;
  document.getElementById('proposalsInput').value = data.proposals.join('\n');
  document.getElementById('governmentPlanInput').value = data.governmentPlan;

  const renderCandidateInputs = (candidates) => {
    candidateFields.innerHTML = candidates
      .map(
        (candidate, index) => `
        <div class="candidate-box">
          <strong>Candidato ${index + 1}</strong>
          <label>Nombre <input type="text" data-field="name" data-index="${index}" value="${candidate.name}" required></label>
          <label>Cargo <input type="text" data-field="role" data-index="${index}" value="${candidate.role}" required></label>
          <label>Descripción <textarea data-field="bio" data-index="${index}" rows="3">${candidate.bio}</textarea></label>
          <label>URL foto <input type="url" data-field="photo" data-index="${index}" value="${candidate.photo}"></label>
        </div>
      `,
      )
      .join('');
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
          `https://dummyimage.com/400x400/e9efe9/0c3b2e&text=Foto+${index + 1}`,
      })),
      proposals: document
        .getElementById('proposalsInput')
        .value.split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      governmentPlan: document.getElementById('governmentPlanInput').value.trim(),
    };

    saveData(current);
    alert('✅ Cambios guardados. Ve al sitio público para revisarlos.');
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
