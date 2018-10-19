const Teams = [
  { id: 1, name: 'Alpha', code: '01', score: 0 },
  { id: 2, name: 'Bravo', code: '02', score: 0 },
  { id: 3, name: 'Charlie', code: '03', score: 0 },
  { id: 4, name: 'Delta', code: '04', score: 0 },
  { id: 5, name: 'Echo', code: '05', score: 0 },
  { id: 6, name: 'Golf', code: '06', score: 0 },
  { id: 7, name: 'Foxtrot', code: '07', score: 0 },
  { id: 8, name: 'Hotel', code: '08', score: 0 },
  { id: 9, name: 'India', code: '09', score: 0 },
  { id: 10, name: 'Juliett', code: '10', score: 0},
  { id: 11, name: 'Kilo', code: '11', score: 0},
  { id: 12, name: 'Lima', code: '12', score: 0}
];

const Passwords = [
  {
    pass: 'MELANCIA',
    min_points: 5,
    points: 100,
    quantity: 10,
    reduction: .1  
  },
  {
    pass: 'ABACAXI',
    points: 50,
    min_points: 5,
    quantity: 20,
    reduction: .1
  },
  {
    pass: 'ACAI',
    min_points: 40,
    points: 50,
    quantity: 4,
    reduction: .15
  }
];

const app = new Vue({
  el: '#app',
  data: {
    passwords: Passwords,
    password_founds: [],
    started: false,
    time_left: 60 * 60 * 1000,
    teams: Teams,
    terminals: [
      {
        id: 1,
        team: null,
        waiting: null,
        pass: null
      },
      {
        id: 2,
        team: null,
        waiting: null,
        pass: null
      }
    ],
    totalScore: 0
  },
  methods: {
    applyPointsReduction: function(points, founds, reduction) {
      if (founds === 0 || points <= 0) {
        return points;
      }
      founds--;
      return this.applyPointsReduction(points - points * reduction, founds, reduction);
    },
    eraseLetter: function(terminalId) {
      const terminal = this.terminalById(terminalId);
      terminal.pass = terminal.pass.slice(0, -1);
    },
    passwordFound: function(pass) {
      return this.passwords
        .reduce(
          (r, p) => {
            if (p.pass === pass) {
              r = true;
            }
            return r;
          }, false
        )
    },
    reserveTerminal: function(letter, terminalId) {
      const terminal = this.terminalById(terminalId);
      terminal.pass = null;
      terminal.waiting = false;
      terminal.team = Object.assign({}, this.teams.find(t => t.name.charAt(0) === letter));
    },
    setToWating: function(terminalId) {
      this.terminalById(terminalId).waiting = true;
    },
    setToFree: function(terminalId) {
      const terminal = this.terminalById(terminalId);
      terminal.pass = false;
      terminal.team = null;
      terminal.waiting = false;
    },
    start: function() {
      setInterval(function() {
        app.$data.time_left -= 1000;
      }, 1000);      
      this.started = true;
    },
    teamFromTerminal: function(terminalId) {
      return this.terminalById(terminalId).team;
    },
    teamPercentage: function(teamId) {
      if (this.totalScore === 0) {
        return 0;
      }
      const team = this.teams.find(t => t.id === teamId);
      if (team.score === 0) {
        return 0;
      }
      return { maxHeight: (team.score * 100) / this.totalScore + '%' };
    },
    terminalById: function(id) {
       return this.terminals.find(t => t.id === id);
    },
    toTimeString: function() {
      const duration = moment.duration(this.time_left);
      const h = duration.hours();
      const m = duration.minutes();
      const s = duration.seconds();
      return `${ h < 10 ? '0' + h : h}:${ m < 10 ? '0' + m : m}:${ s < 10 ? '0' + s : s}`;
    },
    updateTeamScore: function(teamId, points) {
      this.teams
        .find( t => t.id === teamId)
        .score += points;
      this.totalScore += points;
    },
    writeLetter: function(letter, terminalId) {
      const terminal = this.terminalById(terminalId);
      terminal.pass = `${ terminal.pass || ''}${ letter }`;
      if (this.passwordFound(terminal.pass)) {
        const pass = this.passwords
          .find(p => p.pass === terminal.pass);
        const founds = this.password_founds
          .reduce( 
            (r, p) => {
              if (p.pass === terminal.pass) {
                r++;
              }
              return r;
            }, 0
          )
        if (founds === pass.quantity) {
          this.setToFree(terminalId);
          return;  
        }
        const points = founds === 0 
          ? pass.points 
          : this.applyPointsReduction(pass.points, founds, pass.reduction);
        
        this.updateTeamScore(terminal.team.id, points > pass.min_points ? points : pass.min_points);
        this.setToFree(terminalId);
        this.password_founds.push(Object.assign({}, pass));
      }
    }
  }
});
