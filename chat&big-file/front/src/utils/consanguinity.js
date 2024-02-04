import TWEEN from '../../public/statics/tween';

var down = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
var up = 'ontouchstart' in window ? 'touchend' : 'mouseup';
var move = 'ontouchstart' in window ? 'touchmove' : 'mousemove';

var ui = {
  init: function () {
    document.body.addEventListener(
      move,
      function (e) {
        e.preventDefault();
      },
      false
    );
  },
};

function Role(name, chineseName, thumb) {
  this.name = name;
  this.chineseName = chineseName;
  this.x = 0;
  this.y = 0;
  this.radius = 46;
  this.visible = false;
  this.relations = [];
  this.createDOM(chineseName, thumb);
  this.addEvents();
}
Role.domHeroes = document.querySelectorAll('.heroes ul');
Role.domHerolist = document.querySelector('.list');
Role.prototype = {
  createDOM: function (chineseName, thumb) {
    var dom = document.createElement('div');
    dom.className = 'role';
    dom.setAttribute('role', this.name);
    var domImage = document.createElement('img');
    domImage.src = thumb;
    dom.appendChild(domImage);
    var domCover = document.createElement('div');
    domCover.className = 'cover';
    dom.appendChild(domCover);

    var domName = document.createElement('div');
    domName.innerText = chineseName;
    domName.className = 'name';
    dom.appendChild(domName);

    this.dom = dom;
  },

  addEvents: function () {
    var self = this;
    self.dom.addEventListener(down, function (e) {
      var touch = 'ontouchstart' in window ? e.changedTouches[0] : e;
      var startX = touch.clientX;
      var startY = touch.clientY;
      self.dom.addEventListener(up, function (e) {
        var touch = 'ontouchstart' in window ? e.changedTouches[0] : e;
        var disX = touch.clientX - startX;
        var disY = touch.clientY - startY;
        var dis = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));
        if (dis < 5) {
          stage.spread(self.name, true);
        }
        self.dom.removeEventListener(up, arguments);
      });
      e.preventDefault();
    });
  },
  show: function () {
    this.visible = true;
    stage.dom.appendChild(this.dom);
  },
  hide: function () {
    this.visible = false;
    stage.dom.removeChild(this.dom);
  },
  update: function () {
    var self = this;
    var style = self.dom.style;

    if (this.visible) {
      style.left = stage.width / 2 + this.x - this.radius + 'px';
      style.top = stage.height / 2 + this.y - this.radius + 'px';
      style.width = this.radius * 2 + 'px';
      style.height = this.radius * 2 + 'px';

      if (this.level == 1) {
        this.dom.classList.add('selected');
      } else {
        this.dom.classList.remove('selected');
      }
    }
  },
};

function RelationLine(a, b, text, property) {
  this.roleA = a;
  this.roleB = b;
  this.text = text;
  this.property = property;
  this.createDOM();
}
RelationLine.prototype = {
  createDOM: function () {
    var dom = document.createElement('div');
    var domText = document.createElement('div');
    var domInner = document.createElement('span');
    domInner.innerHTML =
      this.text.length < 4 ? '　' + this.text + '　' : this.text;
    domText.appendChild(domInner);
    dom.appendChild(domText);
    dom.className = 'line';
    this.visible = false;
    this.dom = dom;
    this.domText = domText;
    dom.title = this.roleA.name + '-' + this.roleB.name;
  },
  update: function () {
    var self = this;
    var a = this.roleA,
      b = this.roleB;
    var style = this.dom.style;

    if (a.level !== window.undefined && b.level !== window.undefined) {
      var visible = this.visible;
      var isOK =
        a.visible &&
        b.visible &&
        (a.level < b.level || (a.level === b.level && a.name > b.name));

      if (!visible && isOK) {
        stage.dom.appendChild(this.dom);
        this.visible = true;
      }
      if (visible && !isOK) {
        if (stage.dom.contains(self.dom)) {
          stage.dom.removeChild(self.dom);
          self.dom.className = 'line';
          self.visible = false;
        }
      }
      self.dom.className = 'line';
      var n = Math.min(a.level, b.level);
      if (a.level === 0 && b.level == 2) {
        n = 1;
      }
      self.dom.className += ' level' + n;
    }

    if (
      this.visible &&
      (a.level === window.undefined || b.level === window.undefined)
    ) {
      if (stage.dom.contains(self.dom)) {
        stage.dom.removeChild(self.dom);
        self.dom.className = 'line';
        self.visible = false;
      }
    }

    if (!this.visible) {
      return;
    }

    var rotation = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI;
    var length =
      Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)) + 'px';
    if (a == stage.currentRootRole) {
      length = parseInt(length) + 15 + 'px';
    }
    style.left = stage.width / 2 + this.roleA.x + 'px';
    style.top = stage.height / 2 + this.roleA.y + 'px';
    style.width = length;
    if (rotation > Math.PI * 0.75 && rotation < Math.PI * 1.25) {
      this.domText.className = 'r0';
      this.domText.style.width = length;
      this.domText.style.height = '30px';
    } else if (rotation > Math.PI * 0.25 && rotation <= Math.PI * 0.75) {
      this.domText.className = 'r90';
      this.domText.style.width = '30px';
      this.domText.style.height = length;
    } else if (rotation > Math.PI * 1.25 && rotation <= Math.PI * 1.75) {
      this.domText.className = 'r270';
      this.domText.style.width = '30px';
      this.domText.style.height = length;
    } else {
      this.domText.className = 'r180';
      this.domText.style.width = length;
      this.domText.style.height = '30px';
    }
    style.transform =
      'rotateZ(' + ((rotation - Math.PI) * 180) / Math.PI + 'deg)';
  },
};

const stage = {
  dom: document.querySelector('.map .stage'),
  wrap: document.querySelector('.map'),
  roles: {},
  lines: [],
  lastRoles: [],
  currentRoles: [],
  level: 2,
  history: [],
  hasSideBar: true,
  duration: 1000,
  init: function () {
    var self = this;

    this.resize();

    this.attachEvents();

    window.requestAnimationFrame(function () {
      self.update();
    });
  },
  loadData: function (path, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (typeof callback != window.undefined) {
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (
            script.readyState == 'loaded' ||
            script.readyState == 'complete'
          ) {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = function () {
          callback();
        };
      }
    }
    script.src = path;
    document.body.appendChild(script);
  },
  addRoles: function (roles) {
    for (var i = 0; i < roles.length; i++) {
      var arg = roles[i];
      var name = 'hero' + arg[0];
      var role = new Role(name, arg[1], arg[2]);
      this.roles[name] = role;
    }
    this.length = roles.length;
  },
  relate: function (relations) {
    var roles = this.roles;
    outer: for (var i = 0; i < relations.length; i++) {
      var arg = relations[i];
      var roleA = roles['hero' + arg[0]];
      var roleB = roles['hero' + arg[1]];

      if (!roleA || !roleB) {
        continue outer;
      }

      for (var j = 0; j < roleA.relations.length; j++) {
        if (roleA.relations[j].role.name == roleB.name) {
          continue outer;
        }
      }
      var line = new RelationLine(roleA, roleB, arg[2], arg[3]);
      this.lines.push(line);
      roleA.relations.push({ role: roleB, line: line });
    }
  },
  spread: function (name, keep) {
    var self = this;
    var role = this.roles[name];
    if (role === this.currentRoles) {
      return;
    }
    if (this.moving) {
      return;
    }

    self.currentPage = 'hero';

    var delay = 0;
    if (this.stageMoved && !keep) {
      delay = 500;
      if (this.hasSideBar) {
        this.setSide();
      } else {
        this.setCenter();
      }
    }

    window.setTimeout(function () {
      self.dom.className = 'stage moving';
      self.moving = true;
      window.setTimeout(function () {
        stage.dom.className = 'stage';
        stage.moving = false;
      }, self.duration);
      self.lastRootRole = self.currentRootRole;
      self.selectedRole = null;
      self.currentRootRole = role;
      self.lastRoles = self.currentRoles;
      self.currentRoles = [role];
      self.appendRoles = [];
      self.removedRoles = [];
      role.level = 0;
      role.endPos = [0, 0];

      self.createRoles();
      self.fadeRoles();
      self.showRoles();
    }, delay);
  },
  createRoles: function () {
    var directRelations = this.currentRootRole.relations;
    var directRoleNum = Math.min(directRelations.length, 7);
    var inDirectRoleMax = 3;

    var piece = (Math.PI * 2) / directRoleNum;
    var startRotation = 0;
    var radius = 166;
    var subRadius = 80;
    var directDeltas = [];

    for (var i = 0; i < directRoleNum; i++) {
      var role = directRelations[i].role;
      if (role == this.lastRootRole) {
        var rotation = this.clamp(
          Math.atan2(
            role.x - this.currentRootRole.x,
            role.y - this.currentRootRole.y
          )
        );
        startRotation = rotation - this.clamp(piece * i + Math.PI / 2);
      }
    }

    for (var i = 0; i < directRoleNum; i++) {
      var role = directRelations[i].role;
      var delta = this.clamp(startRotation + piece * i + Math.PI / 2);
      role.endPos = [radius * Math.sin(delta), radius * Math.cos(delta)];
      role.level = 1;
      this.currentRoles.push(role);
      directDeltas.push(delta);
    }

    var diff = [
      [0],
      [-Math.PI / 5, Math.PI / 5],
      [-Math.PI / 4, 0, Math.PI / 4],
    ];
    for (var i = 0; i < directRoleNum; i++) {
      var directRole = directRelations[i].role;
      var inDirectRoles = [];

      for (var k = 0; k < directRole.relations.length; k++) {
        if (this.currentRoles.indexOf(directRole.relations[k].role) < 0) {
          inDirectRoles.push(directRole.relations[k].role);
        }
      }
      var inDirectRoleNum = Math.min(inDirectRoles.length, inDirectRoleMax);
      for (var j = 0; j < inDirectRoleNum; j++) {
        var role = inDirectRoles[j];
        var delta = directDeltas[i] + diff[inDirectRoleNum - 1][j];
        role.endPos = [
          directRole.endPos[0] + subRadius * Math.sin(delta),
          directRole.endPos[1] + subRadius * Math.cos(delta),
        ];
        role.level = 2;
        this.currentRoles.push(role);
      }
    }

    for (var i = 0; i < this.currentRoles.length; i++) {
      var role = this.currentRoles[i];
      var index = this.lastRoles.indexOf(role);
      if (index < 0) {
        this.appendRoles.push(role);
      } else {
        delete this.lastRoles[index];
      }
    }

    for (var i = 0; i < this.lastRoles.length; i++) {
      var role = this.lastRoles[i];
      if (role) {
        this.removedRoles.push(role);
      }
    }

    if (this.lastRootRole && this.lastRootRole.level === 1) {
      this.selectedRole = this.lastRootRole;
    } else if (directRelations[0]) {
      this.selectedRole = directRelations[0].role;
    } else {
      this.selectedRole = null;
    }
  },
  fadeRoles: function () {
    var self = this;
    for (var i = 0; i < this.removedRoles.length; i++) {
      (function (i) {
        var role = self.removedRoles[i];
        role.dom.style.opacity = 0;

        var startPos = [role.x, role.y];
        var endPos = [0, 0];
        var pos = { val: 0 };
        var disPos = [endPos[0] - startPos[0], endPos[1] - startPos[1]];
        var tween = new TWEEN.Tween(pos)
          .to({ val: 1 }, self.duration)
          .easing(TWEEN.Easing.Quintic.Out)
          .onUpdate(function () {
            var v = this.val;
            role.x = startPos[0] + disPos[0] * v;
            role.y = startPos[1] + disPos[1] * v;
          })
          .onComplete(function () {
            role.x = 0;
            role.y = 0;
          });
        tween.start();

        window.setTimeout(function () {
          self.dom.removeChild(role.dom);
          role.visible = false;
          delete role.level;
          role.updateLineRemove = true;
        }, 1000);
      })(i);
    }
  },
  showRoles: function () {
    var self = this;
    for (var i = 0; i < this.appendRoles.length; i++) {
      (function (i) {
        var role = self.appendRoles[i];
        stage.dom.insertAdjacentElement('afterbegin', role.dom);
        role.dom.style.opacity = 0;
        role.visible = true;
        role.updateLineAppend = true;
        window.setTimeout(function () {
          role.dom.style.opacity = 1;
        }, 0);
      })(i);
    }
    var roles = this.currentRoles;
    for (var i = 0; i < roles.length; i++) {
      (function (i) {
        roles[i].dom.className = 'role level' + roles[i].level;

        if (self.selectedRole == roles[i].level) {
          roles[i].dom.classList.add('selected');
        }

        var startPos = [roles[i].x, roles[i].y];
        var endPos = roles[i].endPos.slice(0);
        var pos = { val: 0 };
        var disPos = [endPos[0] - startPos[0], endPos[1] - startPos[1]];

        var tween = new TWEEN.Tween(pos)
          .to({ val: 1 }, self.duration)
          .easing(TWEEN.Easing.Quintic.Out)
          .onUpdate(function () {
            try {
              var v = this.val;
              roles[i].x = startPos[0] + disPos[0] * v;
              roles[i].y = startPos[1] + disPos[1] * v;
            } catch (error) {}
          })
          .onComplete(function () {});
        tween.start();
      })(i);
    }
  },
  clamp: function (val) {
    return ((val + Math.PI) % (Math.PI * 2)) - Math.PI;
  },
  resize: function () {
    this.width = this.dom.clientWidth;
    this.height = this.dom.clientHeight;
    if ('ontouchstart' in window) {
      this.dom.style.top =
        (parseInt(document.body.style.height) - this.height) / 2 + 'px';
    }
  },
  setSide: function () {
    if ('ontouchstart' in window) {
      this.dom.style.right =
        (parseInt(document.body.style.width) - 200 - this.width) / 2 + 'px';
      this.dom.style.top =
        (parseInt(document.body.style.height) - this.height) / 2 + 'px';
    }
    this.wrap.style.backgroundPositionX = '80%';
    this.stageMoved = false;
  },
  setCenter: function () {
    if ('ontouchstart' in window) {
      this.dom.style.right =
        (parseInt(document.body.style.width) - this.width) / 2 + 'px';
      this.dom.style.top =
        (parseInt(document.body.style.height) - this.height) / 2 + 'px';
    }
    this.wrap.style.backgroundPositionX = '50%';
    this.stageMoved = false;
  },
  attachEvents: function () {
    var self = this;
    var startX, startY;
    var oriX, oriY;
    self.dom.addEventListener(down, function (e) {
      var touch = 'ontouchstart' in window ? e.changedTouches[0] : e;
      self.touchEnd = false;
      startX = ui.isLandscape ? touch.clientX : touch.clientY;
      startY = ui.isLandscape
        ? touch.clientY
        : window.innerWidth - touch.clientX;
      oriX = parseInt(self.dom.style.left) || 0;
      oriY = parseInt(self.dom.style.top) || 0;
      self.dom.style.transition = 'all 0s';
    });
    self.dom.addEventListener(move, function (e) {
      var touch = 'ontouchstart' in window ? e.changedTouches[0] : e;
      function step() {
        if (self.touchEnd == true) return;
        self.stageMoved = true;
        var moveX = ui.isLandscape ? touch.clientX : touch.clientY;
        var moveY = ui.isLandscape
          ? touch.clientY
          : window.innerWidth - touch.clientX;
        var disX = moveX - startX;
        var disY = moveY - startY;

        self.dom.style.left = disX + oriX + 'px';
        self.dom.style.top = disY + oriY + 'px';

        if (self.touchEnd == false) {
          window.requestAnimationFrame(step);
        }
      }
      window.requestAnimationFrame(step);
      e.preventDefault();
    });
    self.dom.addEventListener(up, function () {
      self.touchEnd = true;
      self.dom.style.transition = 'all 0.3s';
    });
    if (!'ontouchstart' in window) {
      self.dom.addEventListener('mouseleave', function () {
        self.touchEnd = true;
        self.dom.style.transition = 'all 0.3s';
      });
    }
  },
  update: function () {
    var self = this;
    window.requestAnimationFrame(function () {
      self.update();
    });
    for (var key in self.roles) {
      self.roles[key].update();
    }
    for (var key in self.lines) {
      self.lines[key].update();
    }
    TWEEN.update();
  },
};

window.addEventListener(
  'onorientationchange' in window ? 'orientationchange' : 'resize',
  function () {
    var timer = window.setInterval(function () {
      var isLandscape =
        window.matchMedia &&
        window.matchMedia('(orientation: landscape)').matches;
      var width = Math.max(window.innerWidth, window.innerHeight);
      var height = Math.min(window.innerWidth, window.innerHeight);
      if (
        isLandscape !== ui.isLandscape &&
        ui.width !== window.innerWidth &&
        height / width < 0.7
      ) {
        window.clearInterval(timer);
        resizePage();
      }
    }, 100);
  }
);

function resizePage() {
  var width = Math.max(window.innerWidth, window.innerHeight);
  var height = Math.min(window.innerWidth, window.innerHeight);
  document.documentElement.scrollTop = 2;
  var bs = document.body.style;
  var isLandscape =
    window.matchMedia && window.matchMedia('(orientation: landscape)').matches;
  ui.isLandscape = isLandscape;
  ui.width = window.innerWidth;

  if (isLandscape) {
    bs.width = width;
    bs.height = height;
    bs.transform = 'rotateZ(0deg)';
  } else {
    bs.width = width;
    bs.height = height;
    bs.transform = 'rotateZ(90deg) translateY(-' + height + 'px)';
  }
}

const init = (roles, relations, dom, wrap, defaultRole = 'hero1') => {
  stage.dom = dom ?? stage.dom;
  stage.wrap = wrap ?? stage.wrap;
  stage.addRoles(roles);
  stage.relate(relations);
  resizePage();
  stage.init();
  //取消移动的默认事件
  ui.init();
  //随机英雄
  stage.spread(defaultRole);
};

export default init;
