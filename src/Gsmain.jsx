import React, { useEffect } from "react";
import './gs-main.css'

export default function Gsmain() {
  useEffect(() => {
    if (typeof window.p5 === "undefined") {
      console.error("p5.js is not loaded yet");
      return;
    }

    const container = document.getElementById("myCanvas");
    if (container) {
      container.innerHTML = "";
    }

    const sketch = function (e) {
      let t, s, n, r;
      const o = {
        treeCount: 12,
        scl: 20,
        maxDistVal: 1.5,
        randOffsetX: 0,
        randOffsetY: 0,
        randomDelete: 0.5,
        divideCount: 2,
        growingTime: 10,
        lineLen: 4,
        endings: 0.25,
        colorMode: 0,
        showLine: true,
        showGrid: true,
        highlight: true,
        showCross: true,
        showPoints: true,
        showSegments: true,
        showEndings: true,
        showDoubleLine: true,
        pulseShape: 'circle'
      };

      const l = [
        m("#001C34"), // 0: navy
        m("#00A8B5"), // 1: cyan
        m("#FFFFFF"), // 2: white
        m("#1A3EEA")  // 3: electric blue
      ];

      let c, u, d;
      let h = false;
      let f = true;

      function p() {
        const target = document.getElementById("myCanvas");
        u = target ? target.offsetWidth : window.innerWidth;
        d = target ? target.offsetHeight : window.innerHeight;
        if (!u || u < 100) u = window.innerWidth;
        if (!d || d < 100) d = window.innerHeight;
        o.scl = e.floor(e.map(u, 0, 1500, 12, 24));
      }

      function generateFallbackGrid() {
        const pg = e.createGraphics(e.width, e.height);
        pg.pixelDensity(1);
        pg.background(0);
        pg.fill(255);
        pg.textAlign(e.CENTER, e.CENTER);
        pg.textSize(Math.min(e.width * 0.45, e.height * 0.65));
        pg.textStyle(e.BOLD);
        pg.textFont("sans-serif");
        pg.text("IP", e.width / 2, e.height / 2);
        pg.loadPixels();
        return pg;
      }

      function v() {
        e.noiseSeed(e.random(1000));
        if (f) {
          f = false;
          h = false;
          n = Math.sqrt(2 * Math.pow(o.scl, 2)) * o.maxDistVal;
          t = [];
          s = [];

          let imgSource = c;
          if (!imgSource || imgSource.width === 0) {
            imgSource = generateFallbackGrid();
          } else {
            imgSource.resize(e.width, e.height);
          }
          imgSource.loadPixels();

          for (let i = o.scl, l_cnt = 0, u_x = 0; u_x < e.width; u_x += i) {
            for (let d_y = 0; d_y < e.height; d_y += i) {
              const p_idx = 4 * (u_x + d_y * e.width);
              if (imgSource.pixels[p_idx] >= 170 && e.random(1) < o.randomDelete) {
                const v_off = e.random(1) > 0.5 ? e.random(-o.randOffsetX, o.randOffsetX) : 0;
                const m_x = u_x + v_off;
                const w_y = d_y + (v_off === 0 && e.random(1) > 0.5 ? e.random(-o.randOffsetY, o.randOffsetY) : 0);
                const vec = e.createVector(m_x, w_y);
                s.push(new GridPoint(vec, l_cnt));
                l_cnt++;
              }
            }
          }

          if (s.length === 0) {
            const pg = generateFallbackGrid();
            for (let i = o.scl, l_cnt = 0, u_x = 0; u_x < e.width; u_x += i) {
              for (let d_y = 0; d_y < e.height; d_y += i) {
                const p_idx = 4 * (u_x + d_y * e.width);
                if (pg.pixels[p_idx] >= 170 && e.random(1) < o.randomDelete) {
                  s.push(new GridPoint(e.createVector(u_x, d_y), l_cnt));
                  l_cnt++;
                }
              }
            }
          }

          for (let y_idx = 0; y_idx < o.treeCount; y_idx++) {
            if (s.length > 0) {
              const pick = e.random(s);
              if (pick) {
                t.push(new Tree(pick.pos));
              }
            }
          }

          if (r) {
            r.clear();
            for (let pt of s) {
              r.addItem(pt.pos.x, pt.pos.y, pt);
            }
          }
        } else {
          h = true;
        }

        for (let x_idx = 0; x_idx < t.length;) {
          x_idx = 0;
          for (let P in t) {
            const E = t[P];
            if (E.finished) {
              if (!E.branchSet) E.findBranch();
            } else {
              E.grow();
            }
            if (E.finished) x_idx++;
          }
        }
      }

      function m(hex) {
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return match
          ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)]
          : null;
      }

      function Tree(startPos) {
        this.branches = [];
        this.specialBranches = [];
        this.empty = false;
        const root = new Branch(null, startPos || e.createVector(e.width / 2, e.height / 2));
        this.color = e.floor(e.random(1, 4));
        this.branches.push(root);
        this.transitioned = false;
        this.transitionCount = 0;
        this.branchesColors = [];
        this.branchesWeight = [];

        this.findBranch = function () {
          this.branchSet = true;
          let sCount = 0;
          for (let i = 0; i < this.branches.length; i++) {
            const br = this.branches[i];
            if (!br.inSpecial) {
              this.specialBranches.push([]);
              for (let j = 0; j < br.children.length; j++) {
                let curr = br.children[j];
                while (curr != null) {
                  this.specialBranches[sCount].push(curr);
                  curr.inSpecial = true;
                  curr = curr.child;
                }
              }
              if (this.specialBranches[sCount].length === 0) {
                this.specialBranches.splice(sCount, 1);
              } else {
                sCount++;
              }
            }
          }
          for (let k_idx = 0; k_idx < this.specialBranches.length; k_idx++) {
            this.branchesColors.push(e.floor(e.random(1, 4)));
            this.branchesWeight.push(e.random(1) < 0.2);
          }
        };

        this.removePath = function () {
          if (this.branches.length > 0) {
            for (let step = 0; step < 10; step++) {
              const last = this.branches[this.branches.length - 1];
              for (let sIdx = 0; sIdx < this.specialBranches.length; sIdx++) {
                for (let nIdx = 0; nIdx < this.specialBranches[sIdx].length; nIdx++) {
                  if (this.specialBranches[sIdx][nIdx] === last) {
                    this.specialBranches[sIdx].splice(nIdx, 1);
                    break;
                  }
                }
              }
              this.branches.pop();
            }
          } else {
            this.empty = true;
          }
        };

        this.grow = function () {
          this.finished = true;
          for (let i = this.branches.length - 1; i >= 0; i--) {
            const br = this.branches[i];
            let closestBr = null;
            if (!br.full) {
              let closestPt = null;
              let curMinD = n;
              const items = r ? r.getItemsInRadius(br.pos.x, br.pos.y, n, 100) : [];
              for (let item of items) {
                const dDist = window.p5.Vector.dist(item.pos, br.pos);
                if (dDist < curMinD && !item.reached) {
                  closestBr = br;
                  closestPt = item;
                  curMinD = dDist;
                }
              }
              if (closestBr != null && closestPt != null) {
                const nextBr = closestBr.next(closestPt);
                this.branches.push(nextBr);
                nextBr.isGrowing = true;
                closestPt.reached = true;
                this.finished = false;
              } else {
                br.full = true;
              }
            }
          }
        };

        this.show = function () {
          e.strokeWeight(1);
          for (let i = 0; i < this.branches.length; i++) {
            const br = this.branches[i];
            if (!br.inSpecial) br.show();
          }
          for (let nIdx = 0; nIdx < this.specialBranches.length; nIdx++) {
            const clrIdx = this.branchesColors[nIdx];
            const alphaMap = e.map(nIdx, 0, this.specialBranches[nIdx].length - 1, 125, 255);
            if (o.highlight) e.strokeWeight(this.branchesWeight[nIdx] ? 2 : 1);
            if (o.colorMode === 0) e.stroke(l[clrIdx]);
            if (o.colorMode === 1) e.stroke(l[this.color][0], l[this.color][1], l[this.color][2], alphaMap);
            const spList = this.specialBranches[nIdx];
            for (let bIdx = 0; bIdx < spList.length; bIdx++) {
              spList[bIdx].show();
            }
          }
        };
      }

      function GridPoint(posVec, idx) {
        this.pos = posVec || e.createVector(e.random(e.width), e.random(e.height));
        this.reached = false;
        this.idx = idx;
        this.show = function () {
          if (o.pulseShape === 'rect') {
            e.rect(this.pos.x, this.pos.y, 2, 2);
          } else {
            e.ellipse(this.pos.x, this.pos.y, 2, 2);
          }
        };
      }

      function Branch(parentBr, posVec) {
        this.pos = posVec;
        this.origPos = this.pos.copy();
        this.parent = parentBr;
        this.child = null;
        this.children = [];
        this.count = 0;
        this.len = o.scl;
        this.isGrowing = false;
        this.growingCount = 0;
        this.transitioned = false;
        this.endingSpeed = e.random(0.5, 1);
        this.special = e.random(1) < o.endings ? e.floor(e.random(2, e.random(2, 5))) : 1;
        this.animate = e.random(1) > 0.5;
        this.speed = e.random(0.005, 0.02);
        this.look = e.floor(e.random(5));
        this.fc = Math.random();

        this.next = function (targetPt) {
          const nextBr = new Branch(this, targetPt.pos);
          this.child = nextBr;
          this.children.push(this.child);
          return nextBr;
        };

        this.show = function () {
          if (this.child == null && o.showEndings && this.special > 1) {
            for (let sIdx = 1; sIdx <= this.special; sIdx++) {
              let pulseScale = 1;
              let growFactor = 1;
              if (!this.transitioned) {
                this.growingCount += this.endingSpeed;
                if (this.growingCount > 20 * o.growingTime) this.transitioned = true;
                growFactor = this.growingCount / (20 * o.growingTime);
              }
              pulseScale = this.animate
                ? e.map(e.sin(((0.25 * this.fc + 0.1 * sIdx) % 1) * e.TWO_PI), -1, 1, 0, 1) * growFactor
                : e.map(e.sin(((0.25 * this.fc / 4 + 0.1 * sIdx) % 1) * e.TWO_PI), -1, 1, 0, 1) * growFactor;
              const pulseSize = this.len * sIdx * pulseScale;
              if (o.pulseShape === 'rect') {
                e.rect(this.pos.x, this.pos.y, pulseSize, pulseSize);
              } else {
                e.ellipse(this.pos.x, this.pos.y, pulseSize, pulseSize);
              }
            }
          }

          if (this.parent == null || !this.parent.isGrowing) {
            if (this.isGrowing) {
              this.growingCount++;
              if (this.growingCount % o.growingTime === 0) this.isGrowing = false;
              const lerpPos = window.p5.Vector.lerp(this.parent.pos, this.pos, this.growingCount / o.growingTime);
              if (!(this.child == null && o.showEndings && this.special > 1)) {
                e.line(lerpPos.x, lerpPos.y, this.parent.pos.x, this.parent.pos.y);
              }
            } else if (this.parent != null) {
              if (!(this.child == null && o.showEndings && this.special > 1)) {
                if (this.look === 0 && o.showSegments) {
                  if (this.calculatedSegments) {
                    this.showLineSegments();
                  } else {
                    this.calculateLineSegments();
                  }
                } else if (this.look === 1 && o.showPoints) {
                  this.showPoints();
                } else if (this.look === 2 && o.showCross) {
                  this.showCross();
                } else if (this.look === 3 && o.showDoubleLine) {
                  this.showSaw();
                } else if (o.showLine) {
                  e.line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
                }
              }
            }
            this.fc += this.speed;
          }
        };

        this.showPoints = function () {
          for (let dIdx = 0; dIdx < o.divideCount; dIdx++) {
            const ptLerp = window.p5.Vector.lerp(this.pos, this.parent.pos, (dIdx / o.divideCount + this.fc) % 1);
            if (o.pulseShape === 'rect') {
              e.rect(ptLerp.x, ptLerp.y, 2, 2);
            } else {
              e.ellipse(ptLerp.x, ptLerp.y, 1, 1);
            }
          }
        };

        this.showCross = function () {
          e.push();
          e.translate(this.pos.x, this.pos.y);
          if (this.animate) {
            e.rotate(e.PI / 2 + this.fc);
          } else {
            e.rotate(e.PI / 4 + this.fc);
          }
          e.line(-o.scl / o.lineLen, 0, o.scl / o.lineLen, 0);
          e.line(0, -o.scl / o.lineLen, 0, o.scl / o.lineLen);
          e.pop();
        };

        this.showLineSegments = function () {
          for (let sIdx = 0; sIdx < o.divideCount; sIdx++) {
            const seg = this.segments[sIdx];
            if (seg) {
              e.push();
              e.translate(seg.x, seg.y);
              e.rotate(seg.angle + e.PI / 2);
              e.line(-o.scl / o.lineLen, 0, o.scl / o.lineLen, 0);
              e.pop();
            }
          }
        };

        this.showSaw = function () {
          const subVec = window.p5.Vector.sub(this.pos.copy(), this.parent.pos.copy());
          subVec.rotate(e.HALF_PI);
          subVec.setMag(o.scl / 3);
          const pos1 = this.pos.copy().add(subVec);
          const pos2 = this.parent.pos.copy().add(subVec);
          e.line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
          e.line(pos1.x, pos1.y, pos2.x, pos2.y);
        };

        this.calculateLineSegments = function () {
          this.calculatedSegments = true;
          this.segments = [];
          for (let dIdx = 0; dIdx < o.divideCount; dIdx++) {
            const lerpP = window.p5.Vector.lerp(this.pos, this.parent.pos, dIdx / o.divideCount);
            const subVec = window.p5.Vector.sub(this.pos.copy(), this.parent.pos.copy());
            const angle = e.createVector(1, 0).angleBetween(subVec);
            this.segments.push({ x: lerpP.x, y: lerpP.y, angle: angle });
          }
        };
      }

      // Spatial Partition QuadTree
      function Rect(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 1;
        this.height = h || 1;
        this.copy = function () {
          return new Rect(this.x, this.y, this.width, this.height);
        };
      }

      function Bin(maxDepth, maxItemsPerBin, rect, depth) {
        this.rect = rect.copy();
        this.bins = null;
        this.maxDepth = maxDepth;
        this.maxItemsPerBin = maxItemsPerBin;
        this.items = [];
        this.depth = depth || 0;

        this.checkWithinExtent = function (x, y, margin = 0) {
          return (
            x >= this.rect.x - margin &&
            x < this.rect.x + this.rect.width + margin &&
            y >= this.rect.y - margin &&
            y < this.rect.y + this.rect.height + margin
          );
        };

        this.addItem = function (item) {
          if (this.bins === null) {
            this.items.push(item);
            if (this.depth < this.maxDepth && this.items.length > this.maxItemsPerBin) {
              this.subDivide();
            }
          } else {
            const idx = this._getBinIndex(item.x, item.y);
            if (idx !== -1) this.bins[idx].addItem(item);
          }
        };

        this.getItemsInRadius = function (x, y, rad, maxItems) {
          const rSq = Math.pow(rad, 2);
          const result = [];
          if (this.bins) {
            for (let bin of this.bins) {
              if (bin.checkWithinExtent(x, y, rad)) {
                const subItems = bin.getItemsInRadius(x, y, rad, maxItems);
                for (let it of subItems) result.push(it);
              }
            }
          } else {
            for (let itm of this.items) {
              const distSq = Math.pow(itm.x - x, 2) + Math.pow(itm.y - y, 2);
              if (distSq <= rSq) {
                result.push(itm.data);
              }
            }
          }
          return result;
        };

        this.subDivide = function () {
          if (this.bins === null) {
            this.bins = [];
            const halfW = 0.5 * this.rect.width;
            const halfH = 0.5 * this.rect.height;
            for (let nIdx = 0; nIdx < 4; nIdx++) {
              this.bins.push(
                new Bin(
                  this.maxDepth,
                  this.maxItemsPerBin,
                  new Rect(
                    this.rect.x + (nIdx % 2) * halfW,
                    this.rect.y + Math.floor(0.5 * nIdx) * halfH,
                    halfW,
                    halfH
                  ),
                  this.depth + 1
                )
              );
            }
            for (let itm of this.items) {
              const bIdx = this._getBinIndex(itm.x, itm.y);
              if (bIdx !== -1) this.bins[bIdx].addItem(itm);
            }
            this.items = null;
          }
        };

        this._getBinIndex = function (x, y) {
          if (!this.checkWithinExtent(x, y)) return -1;
          const halfW = 0.5 * this.rect.width;
          const halfH = 0.5 * this.rect.height;
          return Math.floor((x - this.rect.x) / halfW) + 2 * Math.floor((y - this.rect.y) / halfH);
        };
      }

      function QuadTree(maxDepth, maxItemsPerBin, extentRect) {
        this.extent = extentRect.copy();
        this.maxDepth = maxDepth;
        this.maxItemsPerBin = maxItemsPerBin;
        this.rootBin = new Bin(this.maxDepth, this.maxItemsPerBin, new Rect(0, 0, this.extent.width, this.extent.height));

        this.clear = function () {
          this.rootBin = new Bin(this.maxDepth, this.maxItemsPerBin, new Rect(0, 0, this.extent.width, this.extent.height));
        };

        this.addItem = function (x, y, data) {
          this.rootBin.addItem({ x, y, data });
        };

        this.getItemsInRadius = function (x, y, rad, maxItems) {
          return this.rootBin.getItemsInRadius(x, y, rad, maxItems);
        };
      }

      e.preload = function () {
        const baseUrl = import.meta.env.BASE_URL || './';
        const imgPath = baseUrl.endsWith('/') ? `${baseUrl}IP.jpg` : `${baseUrl}/IP.jpg`;
        c = e.loadImage(imgPath);
      };

      e.setup = function () {
        p();
        e.createCanvas(u, d, e.P2D).parent("#myCanvas");
        e.pixelDensity(2);
        r = new QuadTree(Infinity, 30, new Rect(0, 0, e.width, e.height));
        v();
        e.rectMode(e.CENTER);

        setInterval(function () {
          v();
        }, 15000);
      };

      e.windowResized = function () {
        p();
        e.resizeCanvas(u, d, e.P2D);
        r = new QuadTree(Infinity, 30, new Rect(0, 0, e.width, e.height));
        v();
      };

      e.mousePressed = function () {
        f = true;
        v();
      };

      e.keyPressed = function () {
        if (e.key === " " || e.key === "r" || e.key === "R") {
          f = true;
          v();
        }
      };

      e.draw = function () {
        e.clear();
        e.noStroke();
        e.fill(l[1][0], l[1][1], l[1][2], 125);
        if (s) {
          for (let i = 0; i < s.length; i++) {
            if (o.showGrid) s[i].show();
          }
        }
        e.noFill();
        if (t) {
          for (let aKey in t) {
            const tree = t[aKey];
            const clr = l[tree.color] || l[1];
            e.stroke(clr[0], clr[1], clr[2]);
            tree.show();
          }
        }
        if (h) {
          let emptyCount = 0;
          for (let uKey in t) {
            const dTree = t[uKey];
            if (dTree.empty) {
              emptyCount++;
            } else {
              dTree.removePath();
              dTree.finished = true;
            }
          }
          if (t && emptyCount === t.length) {
            f = true;
            v();
          }
        }
      };
    };

    const inst = new window.p5(sketch);

    return () => {
      inst.remove();
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="gs-hero-container">

      <div className="gs-canvas-bg">
        <div id="myCanvas" />
      </div>

      <div className="gs-hero-overlay">
        <div className="gs-text-column">
          <div className="gs-title-group">
            {/* <div className="gs-eyebrow-wrap">
              <span className="gs-eyebrow">Protecting world-changing</span>
            </div> */}

            <div className="gs-heading-mask">
              <h1 className="gs-heading">IPGS</h1>
            </div>

            <div className="gs-subheading-wrap">
              <span className="gs-subheading">Intellectual Property Gate System</span>
            </div>
          </div>

          <div className="gs-copy-wrap">
            <p className="gs-copy">
              By combining intelligent technology with expert capabilities, we optimize the entire IP lifecycle and securely protect corporate intellectual property value in the global market.
            </p>
          </div>

          <div className="gs-button-wrap">
            <p className="gs-button">
              <button class="custom-btn btn-gs">DRM 해제</button>
              <button class="custom-btn btn-gs">송수신 IP관리</button>
              <button class="custom-btn btn-gs">DRM 해제</button>
              <button class="custom-btn btn-gs">DRM 해제</button>
              <button class="custom-btn btn-gs">DRM 해제</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
