const today = new Date();
    const dateKey = date => {
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return local.toISOString().slice(0, 10);
    };
    const todayKey = dateKey(today);
    const dateFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.querySelector('#today-label').textContent = dateFormatter.format(today);
    document.querySelector('#agenda-date').textContent = `Atendimentos de ${dateFormatter.format(today)}`;
    document.querySelector('#appointment-date').value = todayKey;
    document.querySelector('#appointment-date').min = todayKey;

    let nextPatientId = 5;
    let nextAppointmentId = 4;
    const patients = [
      { id: 1, name: 'Nala', species: 'Cão', guardian: 'Mariana Costa', phone: '(11) 99912-3456', documents: 'na', icon: '🐕' },
      { id: 2, name: 'Kiwi', species: 'Ave doméstica', guardian: 'Rafael Souza', phone: '(11) 98876-5432', documents: 'na', icon: '🦜' },
      { id: 3, name: 'Bento', species: 'Silvestre / exótico', guardian: 'Luiza Ferreira', phone: '(11) 97765-4321', documents: 'pending', icon: '🐢' },
      { id: 4, name: 'Mimo', species: 'Gato', guardian: 'Carlos Lima', phone: '(11) 96654-3210', documents: 'na', icon: '🐈' }
    ];
    const appointments = [
      { id: 1, patientId: 1, date: todayKey, time: '09:30', type: 'Consulta', veterinarian: 'Dra. Ana Martins', reason: 'Avaliação de rotina' },
      { id: 2, patientId: 2, date: todayKey, time: '11:00', type: 'Retorno', veterinarian: 'Dr. Pedro Alves', reason: 'Reavaliação' },
      { id: 3, patientId: 3, date: todayKey, time: '14:15', type: 'Triagem', veterinarian: 'Dra. Ana Martins', reason: 'Conferir documentação e capacidade' }
    ];
    const speciesIcons = { 'Cão': '🐕', 'Gato': '🐈', 'Ave doméstica': '🦜', 'Pequeno mamífero': '🐇', 'Réptil': '🦎', 'Anfíbio': '🐸', 'Peixe': '🐠', 'Equino': '🐴', 'Bovino': '🐄', 'Outro animal de produção': '🐑', 'Silvestre / exótico': '🐢', 'Outra espécie permitida': '🐾' };
    const pages = [...document.querySelectorAll('.page')];
    const navButtons = [...document.querySelectorAll('[data-page]')];
    const patientDialog = document.querySelector('#patient-dialog');
    const appointmentDialog = document.querySelector('#appointment-dialog');
    const toast = document.querySelector('#toast');
    let toastTimer;

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('visible');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
    }

    function navigate(pageName) {
      pages.forEach(page => page.classList.toggle('active', page.id === `${pageName}-page`));
      navButtons.forEach(button => {
        const active = button.dataset.page === pageName;
        button.classList.toggle('active', active);
        if (active) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
      document.querySelector('#crumb-title').textContent = navButtons.find(button => button.dataset.page === pageName).textContent.trim();
    }

    function patientById(id) {
      return patients.find(patient => patient.id === Number(id));
    }

    function patientSpeciesLabel(patient) {
      return patient.speciesName ? `${patient.speciesName} (${patient.species})` : patient.species;
    }

    function renderPatientRow(patient, container) {
      const row = document.createElement('div');
      row.className = 'patient-row';
      const avatar = document.createElement('span');
      avatar.className = 'pet-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = patient.icon;
      const main = document.createElement('div');
      main.className = 'patient-main';
      const name = document.createElement('div');
      name.className = 'patient-name';
      name.textContent = patient.name;
      const detail = document.createElement('div');
      detail.className = 'patient-detail';
      detail.textContent = `Responsável: ${patient.guardian}`;
      main.append(name, detail);
      const species = document.createElement('span');
      species.className = 'species-tag';
      species.textContent = patientSpeciesLabel(patient);
      row.append(avatar, main, species);
      container.append(row);
    }

    function makeAppointmentRow(appointment) {
      const patient = patientById(appointment.patientId);
      const row = document.createElement('div');
      row.className = 'appointment';
      const time = document.createElement('div');
      time.className = 'appointment-time';
      time.textContent = appointment.time;
      const info = document.createElement('div');
      info.className = 'appointment-info';
      const avatar = document.createElement('span');
      avatar.className = 'pet-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = patient ? patient.icon : '🐾';
      const details = document.createElement('div');
      details.style.minWidth = '0';
      const name = document.createElement('div');
      name.className = 'appointment-name';
      name.textContent = patient ? `${patient.name} · ${patientSpeciesLabel(patient)}` : 'Paciente não encontrado';
      const subline = document.createElement('div');
      subline.className = 'appointment-detail';
      subline.textContent = `${patient ? patient.guardian : ''} · ${appointment.reason || appointment.type} · ${appointment.veterinarian}`;
      details.append(name, subline);
      info.append(avatar, details);
      const type = document.createElement('span');
      type.className = `appointment-type${patient && patient.documents === 'pending' ? ' warning' : ''}`;
      type.textContent = patient && patient.documents === 'pending' ? 'Conferir documentos' : appointment.type;
      row.append(time, info, type);
      return row;
    }

    function renderAppointments() {
      const todayList = document.querySelector('#today-appointments');
      const allList = document.querySelector('#all-appointments');
      todayList.replaceChildren();
      allList.replaceChildren();
      const todayAppointments = appointments.filter(item => item.date === todayKey).sort((a, b) => a.time.localeCompare(b.time));
      const sorted = [...appointments].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
      document.querySelector('#today-count').textContent = todayAppointments.length;
      if (!todayAppointments.length) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = 'Nenhum atendimento agendado para hoje.';
        todayList.append(empty);
      } else {
        todayAppointments.forEach(item => todayList.append(makeAppointmentRow(item)));
      }
      if (!sorted.length) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = 'Ainda não há atendimentos na agenda.';
        allList.append(empty);
      } else {
        sorted.forEach(item => {
          const row = makeAppointmentRow(item);
          const patient = patientById(item.patientId);
          const date = document.createElement('div');
          date.className = 'appointment-time';
          date.textContent = item.date === todayKey ? 'Hoje' : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(`${item.date}T12:00:00`));
          row.replaceChild(date, row.firstChild);
          if (patient && patient.documents === 'pending') row.querySelector('.appointment-type').classList.add('warning');
          allList.append(row);
        });
      }
    }

    function renderPatients() {
      const recent = document.querySelector('#recent-patients');
      recent.replaceChildren();
      [...patients].slice(-3).reverse().forEach(patient => renderPatientRow(patient, recent));
      const body = document.querySelector('#patients-table');
      const query = document.querySelector('#patient-search').value.trim().toLocaleLowerCase('pt-BR');
      const filtered = patients.filter(patient => [patient.name, patient.species, patient.speciesName || '', patient.guardian, patient.phone].some(value => value.toLocaleLowerCase('pt-BR').includes(query)));
      body.replaceChildren();
      document.querySelector('#patient-count').textContent = patients.length;
      document.querySelector('#doc-count').textContent = patients.filter(patient => patient.documents === 'pending').length;
      if (!filtered.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.className = 'empty';
        cell.textContent = 'Nenhum paciente encontrado.';
        row.append(cell);
        body.append(row);
        return;
      }
      filtered.forEach(patient => {
        const row = document.createElement('tr');
        const name = document.createElement('td');
        const strong = document.createElement('strong');
        strong.textContent = `${patient.icon} ${patient.name}`;
        name.append(strong);
        const species = document.createElement('td');
        species.textContent = patientSpeciesLabel(patient);
        const guardian = document.createElement('td');
        guardian.textContent = patient.guardian;
        const phone = document.createElement('td');
        phone.textContent = patient.phone;
        const docs = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `doc-status${patient.documents === 'pending' ? ' pending' : ''}`;
        badge.textContent = patient.documents === 'verified' ? 'Conferida' : patient.documents === 'pending' ? 'Pendente' : 'A confirmar';
        docs.append(badge);
        row.append(name, species, guardian, phone, docs);
        body.append(row);
      });
    }

    function renderPatientOptions() {
      const select = document.querySelector('#appointment-patient');
      select.replaceChildren();
      patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = `${patient.name} · ${patientSpeciesLabel(patient)} — ${patient.guardian}`;
        select.append(option);
      });
    }

    navButtons.forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
    document.querySelectorAll('[data-navigate]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.navigate)));
    document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); navigate('painel'); });
    document.querySelectorAll('[data-open="patient"]').forEach(button => button.addEventListener('click', () => patientDialog.showModal()));
    document.querySelectorAll('[data-open="appointment"]').forEach(button => button.addEventListener('click', () => {
      if (!patients.length) {
        showToast('Cadastre um paciente antes de agendar.');
        patientDialog.showModal();
        return;
      }
      renderPatientOptions();
      appointmentDialog.showModal();
    }));
    document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
    [patientDialog, appointmentDialog].forEach(dialog => dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    }));
    document.querySelector('#patient-search').addEventListener('input', renderPatients);

    document.querySelector('#patient-form').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const species = data.get('species');
      const patient = {
        id: nextPatientId++,
        name: data.get('petName').trim(),
        species,
        speciesName: data.get('speciesName').trim(),
        guardian: data.get('guardian').trim(),
        phone: data.get('phone').trim(),
        documents: data.get('documents'),
        icon: speciesIcons[species] || '🐾'
      };
      patients.push(patient);
      renderPatients();
      renderPatientOptions();
      form.reset();
      patientDialog.close();
      showToast(`${patient.name} foi cadastrado.`);
    });

    document.querySelector('#appointment-form').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const date = data.get('date');
      if (date < todayKey) {
        showToast('Selecione uma data a partir de hoje.');
        return;
      }
      const appointment = {
        id: nextAppointmentId++,
        patientId: Number(data.get('patientId')),
        date,
        time: data.get('time'),
        type: data.get('type'),
        veterinarian: data.get('veterinarian').trim(),
        reason: data.get('reason').trim()
      };
      appointments.push(appointment);
      renderAppointments();
      form.reset();
      document.querySelector('#appointment-date').value = todayKey;
      document.querySelector('#appointment-dialog').close();
      showToast('Atendimento adicionado à agenda.');
    });

    renderPatients();
    renderAppointments();
