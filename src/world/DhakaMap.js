import * as THREE from 'three';
import { toBengaliNumber } from '../ui/Textures.js';

export class DhakaMap {
  constructor(scene) {
    this.scene = scene;

    // Iconic Dhaka Metro Rail (MRT-6) & Highway Route Stations
    this.stations = [
      { name: 'মিরপুর ১০', dist: 0, tag: 'গোলচত্বর: দেশি টেসলার আঁতুড়ঘর' },
      { name: 'কাজীপাড়া', dist: 250, tag: 'মেট্রো স্টেশন: উল্টাপথের চ্যাম্পিয়ন' },
      { name: 'শেওড়াপাড়া', dist: 550, tag: 'সরু রাস্তা ও তীব্র বাসের চাপ' },
      { name: 'আগারগাঁও', dist: 900, tag: 'পাসপোর্ট অফিস ও নির্বাচন কমিশন মোড়' },
      { name: 'বিজয় সরণি', dist: 1300, tag: 'ফোয়ারা মোড়: ভিআইপি প্রাদোর কনভয়!' },
      { name: 'ফার্মগেট', dist: 1750, tag: 'ওভারব্রিজ: আনন্দ সিনেমা ও বাসের রেষারেষি' },
      { name: 'কারওয়ান বাজার', dist: 2200, tag: 'পাইকারি আড়ৎ: সবজি ও কাঁচাবাজারের ভ্যান' },
      { name: 'বাংলামোটর', dist: 2650, tag: 'মোটর পার্টস মার্কেট: পার্টস চুরির স্বর্গ' },
      { name: 'শাহবাগ', dist: 3100, tag: 'ফুলের দোকান ও সার্জেন্টের কড়া নজর' },
      { name: 'ঢাকা বিশ্ববিদ্যালয়', dist: 3600, tag: 'টিএসসি ও কার্জন হল: রিকশার প্যারেড' },
      { name: 'মতিঝিল', dist: 4200, tag: 'শাপলা চত্বর: বাপের রাস্তার চূড়ান্ত রাজত্ব!' }
    ];

    this.currentStationIndex = 0;
    this.totalDistanceMeters = 0;

    // Overhead Highway Green Directional Signboards
    this.overheadGantries = [];
    this.initHighwayGantries();
  }

  // Create iconic Green Bangladeshi Highway Gantry Signboards spanning the road
  initHighwayGantries() {
    const signsData = [
      {
        z: -120,
        left: '⬅ গাবতলী / মিরপুর ১',
        center: '⬆ কাজীপাড়া · ফার্মগেট ⬆',
        right: 'মহাখালী / বনানী ➡'
      },
      {
        z: -380,
        left: '⬅ শেওড়াপাড়া',
        center: '⬆ আগারগাঁও · বিজয় সরণি ⬆',
        right: 'গুলশান ➡'
      },
      {
        z: -750,
        left: '⬅ শ্যামলী / মোহাম্মদপুর',
        center: '⬆ ফার্মগেট · শাহবাগ ⬆',
        right: 'জাহাঙ্গীর গেট / তেজগাঁও ➡'
      },
      {
        z: -1150,
        left: '⬅ মানিক মিয়া এভিনিউ',
        center: '⬆ কারওয়ান বাজার · মতিঝিল ⬆',
        right: 'কাকরাইল ➡'
      },
      {
        z: -1600,
        left: '⬅ ধানমন্ডি / কলাবাগান',
        center: '⬆ ঢাকা বিশ্ববিদ্যালয় · মতিঝিল ⬆',
        right: 'মগবাজার ➡'
      }
    ];

    for (let i = 0; i < signsData.length; i++) {
      const gantry = this.createOverheadGantry(signsData[i]);
      gantry.position.set(0, 0, signsData[i].z);
      this.scene.add(gantry);
      this.overheadGantries.push({ mesh: gantry, baseZ: signsData[i].z, data: signsData[i] });
    }
  }

  createOverheadGantry(data) {
    const group = new THREE.Group();
    const gantryHeight = 5.8;
    const spanWidth = 27;

    // Steel truss structure spanning across the road
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(spanWidth, 0.35, 0.35), steelMat);
    beam.position.set(0, gantryHeight, 0);
    group.add(beam);

    const pillarGeo = new THREE.CylinderGeometry(0.28, 0.32, gantryHeight, 16);
    const pillarL = new THREE.Mesh(pillarGeo, steelMat);
    pillarL.position.set(-spanWidth / 2 + 1, gantryHeight / 2, 0);
    const pillarR = new THREE.Mesh(pillarGeo, steelMat);
    pillarR.position.set(spanWidth / 2 - 1, gantryHeight / 2, 0);
    group.add(pillarL);
    group.add(pillarR);

    // 1. Right Carriageway Signboard (Main Driving Direction: Mirpur -> Motijheel)
    const canvasR = document.createElement('canvas');
    canvasR.width = 512;
    canvasR.height = 256;
    const ctxR = canvasR.getContext('2d');
    ctxR.fillStyle = '#065f46';
    ctxR.fillRect(0, 0, 512, 256);
    ctxR.strokeStyle = '#ffffff';
    ctxR.lineWidth = 8;
    ctxR.strokeRect(8, 8, 496, 240);

    ctxR.fillStyle = '#fde047';
    ctxR.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctxR.textAlign = 'center';
    ctxR.fillText(data.center, 256, 110);

    ctxR.fillStyle = '#ffffff';
    ctxR.font = 'bold 30px "Hind Siliguri", sans-serif';
    ctxR.fillText(data.right, 256, 175);

    ctxR.fillStyle = '#facc15';
    ctxR.font = 'bold 18px sans-serif';
    ctxR.fillText('ঢাকা মেট্রো রুট এন-১ (MRT-6)', 256, 45);

    const boardTexR = new THREE.CanvasTexture(canvasR);
    const boardR = new THREE.Mesh(
      new THREE.PlaneGeometry(10.5, 2.3),
      new THREE.MeshStandardMaterial({ map: boardTexR, side: THREE.DoubleSide })
    );
    boardR.position.set(6.2, gantryHeight - 1.25, 0);
    group.add(boardR);

    // 2. Left Carriageway Signboard (Oncoming / Wrong-Way Direction)
    const canvasL = document.createElement('canvas');
    canvasL.width = 512;
    canvasL.height = 256;
    const ctxL = canvasL.getContext('2d');
    ctxL.fillStyle = '#065f46';
    ctxL.fillRect(0, 0, 512, 256);
    ctxL.strokeStyle = '#ffffff';
    ctxL.lineWidth = 8;
    ctxL.strokeRect(8, 8, 496, 240);

    ctxL.fillStyle = '#ffffff';
    ctxL.font = 'bold 34px "Hind Siliguri", sans-serif';
    ctxL.textAlign = 'center';
    ctxL.fillText(data.left, 256, 120);

    ctxL.fillStyle = '#fde047';
    ctxL.font = 'bold 26px "Hind Siliguri", sans-serif';
    ctxL.fillText('⛔ উল্টাপথ করিডোর', 256, 185);

    ctxL.fillStyle = '#facc15';
    ctxL.font = 'bold 18px sans-serif';
    ctxL.fillText('মিরপুর করিডোর', 256, 45);

    const boardTexL = new THREE.CanvasTexture(canvasL);
    const boardL = new THREE.Mesh(
      new THREE.PlaneGeometry(10.5, 2.3),
      new THREE.MeshStandardMaterial({ map: boardTexL, side: THREE.DoubleSide })
    );
    boardL.position.set(-6.2, gantryHeight - 1.25, 0);
    group.add(boardL);

    return group;
  }

  update(playerZ) {
    // Player moves in -Z direction, so total distance = -playerZ
    this.totalDistanceMeters = Math.max(0, Math.round(-playerZ));

    // Find current station
    let currentIdx = 0;
    for (let i = 0; i < this.stations.length; i++) {
      if (this.totalDistanceMeters >= this.stations[i].dist) {
        currentIdx = i;
      }
    }

    const previousIdx = this.currentStationIndex;
    this.currentStationIndex = currentIdx;

    // Check if player just reached a new station milestone!
    let reachedNewStation = null;
    if (currentIdx > previousIdx) {
      reachedNewStation = this.stations[currentIdx];
    }

    // Next station information
    const nextStation = this.stations[Math.min(this.stations.length - 1, currentIdx + 1)];
    const distToNext = Math.max(0, nextStation.dist - this.totalDistanceMeters);

    // Endless recycling of overhead direction gantries
    for (const g of this.overheadGantries) {
      if (g.mesh.position.z > playerZ + 40) {
        let minZ = 0;
        for (const other of this.overheadGantries) {
          if (other.mesh.position.z < minZ) minZ = other.mesh.position.z;
        }
        g.mesh.position.z = minZ - 350;
      }
    }

    return {
      currentStation: this.stations[currentIdx],
      nextStation: nextStation,
      distToNext: distToNext,
      totalDistance: this.totalDistanceMeters,
      reachedNewStation: reachedNewStation
    };
  }

  reset() {
    this.currentStationIndex = 0;
    this.totalDistanceMeters = 0;
    for (let i = 0; i < this.overheadGantries.length; i++) {
      this.overheadGantries[i].mesh.position.z = this.overheadGantries[i].baseZ;
    }
  }
}
