 var T$ = function(id) {
        return document.getElementById(id);
    }

    var $extend = function(des, src) {
        for (var p in src) {
            des[p] = src[p]
        }
        return des;
    }

    var Bubble = function() {
        // 气泡随机样式
        var clss = ['ball_one', 'ball_two'];
        var Ball = function(radius, clsname) {
            var ball = document.createElement('div');
            ball.className = clsname;
            with(ball.style) {
                width = height = (radius || 10) + 'px';  position = 'absolute';
            }
            return ball;
        };

        // 屏保主类
        var Screen = function(cid, config) {
            var self = this;
            if (!(self instanceof Screen)) {
                return new Screen(cid, config);
            }
            self.container = T$(cid);
            if (!self.container) return;
            config = $extend(Screen.Config, config || {});
            // 配置属性
            self.ballsnum = config.ballsnum;
            self.diameter = 55;
            self.radius = self.diameter / 2;
            self.bounce = config.bounce;
            self.spring = config.spring;
            self.gravity = config.gravity;
            self.balls = [];
            self.timer = null;
            // 上下左右边界
            self.T_bound = 0;
            self.B_bound = self.container.clientHeight;
            self.L_bound = 0;
            self.R_bound = self.container.clientWidth;
        };

        // 静态属性
        Screen.Config = {
            ballsnum: 5,   // 气泡数目
            spring: 0.3,   // 弹力加速度
            bounce: -0.95, // 反弹
            gravity: 0   // 重力
        };

        Screen.prototype = {
            initialize: function() {
                var self = this;
                // 生成气泡
                self.createBalls();
                // 侦听碰撞
                self.timer = setInterval(function() {
                    self.hitTest();
                }, 32);
            },
            createBalls: function() {
			    //生成红色气泡
                var self = this, num = self.ballsnum, i = 0;
                var frag = document.createDocumentFragment();
				var ball = new Ball(70+Math.random()*40, clss[0]);
                    ball.radius = self.radius;
                    ball.diameter = self.diameter;
                    ball.style.left = (Math.random() * self.B_bound) + 'px';
                    ball.style.top = (Math.random() * self.R_bound) + 'px';
                    ball.vx = Math.random() * 6 - 3;
                    ball.vy = Math.random() * 6 - 3;
                    frag.appendChild(ball);
                    self.balls[i] = ball;
				//生成蓝色气泡
                for (i=1; i < num; i++) {
                    var ball = new Ball(70+Math.random()*40, clss[1]);
                    ball.radius = self.radius;
                    ball.diameter = self.diameter;
                    ball.style.left = (Math.random() * self.B_bound) + 'px';
                    ball.style.top = (Math.random() * self.R_bound) + 'px';
                    ball.vx = Math.random() * 6 - 7;
                    ball.vy = Math.random() * 6 - 7;
                    frag.appendChild(ball);
                    self.balls[i] = ball;
                }
                self.container.appendChild(frag);
            },
            // 碰撞检测
            hitTest: function() {
                var self = this, num = self.ballsnum, balls = self.balls;
                for (var i = 0; i < num - 1; i++) {
                    var ball0 = balls[i];
                    ball0.x = ball0.offsetLeft + ball0.radius;
                    ball0.y = ball0.offsetTop + ball0.radius;
                    for (var j = i + 1; j < num; j++) {
                        var ball1 = balls[j];
                        ball1.x = ball1.offsetLeft + ball1.radius;
                        ball1.y = ball1.offsetTop + ball1.radius;
                        var dx = ball1.x - ball0.x;
                        var dy = ball1.y - ball0.y;
                        var dist = Math.sqrt(dx * dx + dy * dy);
                        var misDist = ball0.radius + ball1.radius;
                        if (dist < misDist) {
                            var angle = Math.atan2(dy, dx);
                            var tx = ball0.x + Math.cos(angle) * misDist;
                            var ty = ball0.y + Math.sin(angle) * misDist;
                            var ax = (tx - ball1.x) * self.spring;
                            var ay = (ty - ball1.y) * self.spring;
                            ball0.vx -= ax;
                            ball0.vy -= ay;
                            ball1.vx += ax;
                            ball1.vy += ay;
                        }
                    }
                }
                
                for (var i = 0; i < num; i++) {
                    self.move(balls[i]);
                }
				
            },
            // 气泡运动
            move: function(ball) {
                var self = this,balls = self.balls;
				if(ball != balls[0]){
                ball.vy += self.gravity;
                ball.style.left = (ball.offsetLeft + ball.vx) + 'px';
                ball.style.top = (ball.offsetTop + ball.vy) + 'px';
                // 蓝色气泡边界检测
                var T = self.T_bound, B = self.B_bound, L = self.L_bound, R = self.R_bound, BC = self.bounce;
                if (ball.offsetLeft  > R-ball.diameter) {
                    ball.style.left = L + 'px';
                    ball.vx *= (-BC);
                } else if (ball.offsetLeft < L) {
                    ball.style.left = R - ball.diameter + 'px';
                    ball.vx *= (-BC);
                }
                if (ball.offsetTop  > B - ball.diameter) {
                    ball.style.top =  T + 'px';
                    ball.vy *= (-BC);
                } else if (ball.offsetTop < T ) {
                    ball.style.top = B -ball.diameter + 'px';
                    ball.vy *= (-BC);
                }
				}else{
				var self = this;
			    ball.vy += self.gravity;
			    ball.style.left = (ball.offsetLeft + ball.vx) + 'px';
			    ball.style.top = (ball.offsetTop + ball.vy) + 'px';
			    // 红色气泡边界检测
			    var T = self.T_bound, B = self.B_bound, L = self.L_bound, R = self.R_bound, BC = self.bounce;
			    if (ball.offsetLeft + ball.diameter > R) {
				    ball.style.left = R - ball.diameter + 'px';
				    ball.vx *= BC;
			    } else if (ball.offsetLeft < L) {
				    ball.style.left = L + 'px';
				    ball.vx *= BC;
			    } 
			    if (ball.offsetTop + ball.diameter > B) {
				    ball.style.top = B - ball.diameter + 'px';
				    ball.vy *= BC;
			    } else if (ball.offsetTop < T) {
				    ball.style.top = T + 'px';
				    ball.vy *= BC;
			    }
			}
        }

        };
        return { Screen: Screen }
    }();
	window.onload = function() {
        var sc = null;
        T$('start').onclick = function() {
            document.getElementById('inner').innerHTML = '';
            sc = Bubble.Screen('inner', { ballsnum: Math.floor(Math.random() * 10), spring: 0.8, bounce: -0.95, gravity: 0});
            sc.initialize();
			document.getElementById('inner').onmousemove =function(ev){
			var x = document.getElementsByClassName("ball_one");;
		    var oEvent = ev ||event
		    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            x[0].style.top = (oEvent.clientY + scrollTop - 40) + 'px';
            x[0].style.left = (oEvent.clientX + scrollLeft - 600) + 'px';
			};
        };
        T$('stop').onclick = function() { clearInterval(sc.timer); }
    }