// Wai manifesto — 4:3, 30fps, 105.6s. Every shot below sits on a cut point of
// the reference edit (a16z's brand film), with its reference counterpart noted.

export const M_FPS = 30;
export const M_W = 1440;
export const M_H = 1080;
export const M_DURATION = 3168;

export const f = (s: number) => Math.round(s * M_FPS);

export type Look = 'archival' | 'modern' | 'gold' | 'night';

export type Screen =
  | 'retroEmr'
  | 'earlyPortal'
  | 'phoneProfile'
  | 'scribeTerminal'
  | 'aiVoice'
  | 'askWai'
  | 'scribeNote'
  | 'schedule'
  | 'confirmBooking'
  | 'signNote';

export type Shot =
  | {kind: 'clip'; src: string; at: number; to: number; look: Look; trim?: number; push?: number}
  | {kind: 'screen'; screen: Screen; at: number; to: number}
  | {kind: 'engraving'; at: number; to: number; chalk?: boolean}
  | {kind: 'goldHead'; at: number; to: number}
  | {kind: 'handsSpark'; at: number; to: number}
  | {kind: 'products'; at: number; to: number}
  | {kind: 'mosaic'; at: number; to: number}
  | {kind: 'logo'; at: number; to: number}
  | {kind: 'black'; at: number; to: number};

const A = (n: string) => `wai/manifesto/archival/${n}.mp4`;
const Mo = (n: string) => `wai/manifesto/modern/${n}.mp4`;
const O = (n: string) => `wai/origin/${n}.mp4`;
const H = (n: string) => `wai/manifesto/hd/${n}.mp4`;

const clip = (src: string, at: number, to: number, look: Look, trim = 0, push?: number): Shot => ({
  kind: 'clip',
  src,
  at,
  to,
  look,
  trim,
  push,
});

// Times in seconds.
export const shots: Shot[] = [
  // ACT I — the past. Archival, public domain.
  clip(A('a_nurse_desk'), 0, 3, 'archival', 0.4, 0.12), // book lands on the library desk
  clip(A('a_pen_writing'), 3, 5, 'archival', 0.3), // book opens
  clip(A('a_record_card'), 5, 5.5, 'archival', 0.5), // pages flip
  clip(A('a_waveform'), 5.5, 6, 'archival', 0.6), // waveform plate
  clip(A('a_heart_diagram'), 6, 6.5, 'archival', 0.5), // patent drawing
  clip(A('a_circulation'), 6.5, 7, 'archival', 0.5), // patent drawing
  clip(A('a_ct_mechanics'), 7, 7.5, 'archival', 0.5), // tape-drive computer
  clip(A('a_ct_console'), 7.5, 8, 'archival', 0.5), // machine room
  clip(A('a_microscope_woman'), 8, 8.5, 'archival', 0.8), // founder at a laptop
  clip(A('a_ct_patient_face'), 8.5, 9, 'archival', 0.5), // profile
  clip(A('a_ct_doctor_scan'), 9, 11, 'archival', 0.4, 0.06), // the keynote reveal
  clip(A('a_nurse_bedside'), 11, 14.3, 'archival', 1.2, 0.05), // interview soundbite
  clip(A('a_records_poring'), 14.3, 15, 'archival', 0.5), // messy desk
  clip(A('a_terminal_kid'), 15, 17, 'archival', 0.5), // at the old Mac
  clip(A('a_radio_announcer'), 17, 18.1, 'archival', 0.5), // second interview
  clip(A('a_teletype'), 18.1, 19.3, 'archival', 0.4), // typing
  {kind: 'screen', screen: 'retroEmr', at: 19.3, to: 20.6}, // Netscape
  clip(A('a_scan_photo'), 20.6, 21.3, 'archival', 0.5), // holding the card
  clip(A('a_lab_nurses'), 21.3, 21.7, 'archival', 0.5), // tinkering
  clip(A('a_vaccinating'), 21.7, 22.1, 'archival', 0.5), // learn, play…
  clip(A('a_polio_chart'), 22.1, 22.8, 'archival', 0.5), // …trade
  {kind: 'screen', screen: 'earlyPortal', at: 22.8, to: 24}, // early Airbnb
  {kind: 'black', at: 24, to: 25.3},

  // ACT II — the spark.
  {kind: 'engraving', at: 25.3, to: 27.2}, // goddess holding the sun
  {kind: 'engraving', at: 27.2, to: 27.45, chalk: true}, // chalk negative
  {kind: 'goldHead', at: 27.45, to: 29.5}, // golden statue
  clip(O('flame'), 29.5, 30.2, 'gold', 2), // golden hand with orb
  clip(H('rays_of_the_sun_shining_through_'), 30.2, 31, 'gold', 2), // orb in flight
  clip(H('city_at_night'), 31, 32.1, 'night', 2), // dark city
  clip(H('sun_reflecting_on_the_water'), 32.1, 33.8, 'gold', 1), // orb in the lens
  clip(H('a_beautiful_sunrise_in_lisbon'), 33.8, 36.1, 'gold', 2, 0.1), // golden burst
  clip(O('earth_space'), 36.1, 38, 'modern', 1), // Earth

  // ACT III — the present.
  clip(H('jogging_across_pedestrian_crossi'), 38, 38.8, 'modern', 3), // overhead crosswalk
  clip(H('businesswoman_checking_the_time_'), 38.8, 39.2, 'modern', 4), // phone selfie
  {kind: 'screen', screen: 'phoneProfile', at: 39.2, to: 39.7}, // ride-hail app
  clip(H('a_female_s_hands_typing_on_lapto'), 39.7, 40.2, 'modern', 2), // typing
  clip(O('hand_drawing'), 40.2, 41, 'modern', 2), // stylus
  clip(Mo('tablet_brain'), 41, 41.4, 'modern', 2), // tablet
  {kind: 'screen', screen: 'scribeTerminal', at: 41.4, to: 42.7}, // terminal
  clip(H('sunlight_shining_through_green_l'), 42.7, 43, 'gold', 2), // light streak
  clip(Mo('screen_brain'), 43, 44, 'modern', 1), // Waymo
  clip(Mo('brain_models'), 44, 44.7, 'modern', 2), // lidar
  clip(H('science_experiment'), 44.7, 45.4, 'modern', 2), // point cloud
  clip(Mo('dna_scans'), 45.4, 46, 'modern', 2), // car in the ring
  clip(H('putting_medical_gloves_on'), 46, 47.5, 'modern', 2), // drone render
  clip(Mo('brain_monitor'), 47.5, 48, 'modern', 2), // MRI
  clip(O('cells_micro'), 48, 48.9, 'modern', 2), // cracked earth
  {kind: 'screen', screen: 'phoneProfile', at: 48.9, to: 49.4}, // biological-age app
  {kind: 'screen', screen: 'aiVoice', at: 49.4, to: 52}, // "Am I actually talking?"
  {kind: 'screen', screen: 'askWai', at: 52, to: 52.7}, // "What's on your mind today?"
  {kind: 'screen', screen: 'scribeNote', at: 52.7, to: 54}, // code editor
  {kind: 'screen', screen: 'schedule', at: 54, to: 54.5}, // design tool
  clip(Mo('reception'), 54.5, 54.8, 'modern', 1), // desk monitor
  {kind: 'screen', screen: 'confirmBooking', at: 54.8, to: 55.4}, // "Place order"
  {kind: 'screen', screen: 'signNote', at: 55.4, to: 55.9}, // "Approve payroll"
  clip(H('close_up_typing_on_mobile_phone'), 55.9, 56.6, 'modern', 2), // tap to pay
  clip(H('a_senior_man_using_a_laptop'), 56.6, 58.4, 'modern', 2, 0.05), // old man and the orb
  clip(Mo('home_nurse'), 58.4, 60.4, 'modern', 2, 0.06), // the orb, close
  {kind: 'handsSpark', at: 60.4, to: 63.5}, // robot hand meets human hand
  clip(H('sun_reflecting_on_the_seawater'), 63.5, 65, 'gold', 1), // hyperspace
  clip(H('checking_blood_pressure'), 65, 66.3, 'modern', 2), // Colosseum
  clip(H('iv_in_hospital_room'), 66.3, 67.1, 'modern', 2), // canyon
  clip(H('patient_donating_blood'), 67.1, 67.9, 'modern', 2), // village
  clip(Mo('heartbeat_monitor'), 67.9, 68.2, 'modern', 1), // domed room
  clip(H('nature_through_airplane_window'), 68.2, 68.9, 'modern', 2), // blur
  clip(H('a_field_above_the_clouds'), 68.9, 71, 'modern', 2), // jet through cloud
  clip(Mo('doctor_office'), 71, 72, 'modern', 2), // portrait
  clip(Mo('portrait_dentist'), 72, 72.5, 'modern', 1), // portrait
  clip(O('dentist_portrait'), 72.5, 73.5, 'modern', 1), // portrait
  clip(H('close_up_of_an_old_man_s_face'), 73.5, 74.5, 'modern', 2), // portrait
  clip(H('grandfather_and_granddaughter'), 74.5, 75.1, 'modern', 2), // the pair
  clip(Mo('patient_good_news'), 75.1, 76, 'modern', 2), // portrait

  // ACT IV — the build.
  clip(H('friends_laughing_and_looking_at_'), 76, 77, 'modern', 2), // Times Square billboard
  clip(Mo('applause'), 77, 78, 'modern', 1), // NYSE
  clip(H('a_young_man_showing_results_in_a'), 78, 79.4, 'modern', 2), // NYSE
  clip(H('family_waving_sparklers'), 79.4, 80.7, 'modern', 2), // Nasdaq
  clip(Mo('capsule_machine'), 80.7, 81.5, 'modern', 1), // chip conveyor
  clip(Mo('circuit_machine'), 81.5, 83.3, 'modern', 1), // robot arms
  clip(Mo('lab_zoomout'), 83.3, 84, 'modern', 1), // city at night
  clip(H('taking_vitamins'), 84, 84.9, 'modern', 2), // gloved hand, chip
  clip(Mo('heli_takeoff'), 84.9, 86.5, 'modern', 1), // launch pad
  clip(H('a_city_at_night'), 86.5, 87.3, 'night', 3), // the tower
  clip(Mo('vitals'), 87.3, 87.8, 'modern', 1), // control room
  clip(H('sun_reflecting_through_a_bamboo_'), 87.8, 88.3, 'gold', 2), // streak
  clip(Mo('heli_rescue'), 88.3, 89.2, 'modern', 4), // liftoff
  clip(O('flame'), 89.2, 90, 'gold', 1), // fire
  clip(O('drone_flying'), 90, 91.2, 'modern', 1), // ascent
  clip(Mo('patient_good_news'), 91.2, 92.5, 'modern', 4), // faces in the control room
  clip(Mo('applause'), 92.5, 93.5, 'modern', 4), // the cheer
  {kind: 'products', at: 93.5, to: 96}, // portfolio logos
  {kind: 'mosaic', at: 96, to: 98.5}, // the logo wall
  {kind: 'logo', at: 98.5, to: 105.6},
];

// Narration. `n*` is the narrator, `s*` are genuine archival soundbites, `ai01` is Wai.
export const voice: {id: string; at: number; vol?: number}[] = [
  {id: 'n01', at: 1.8},
  {id: 'n02', at: 4.8},
  {id: 'n03', at: 8.3},
  {id: 's1_nursing1942', at: 11.2, vol: 1},
  {id: 'n04', at: 17.0},
  {id: 'n06', at: 21.2},
  {id: 'n07', at: 25.7},
  {id: 'n08', at: 28.9},
  {id: 'n09', at: 34.0},
  {id: 'n10', at: 38.3},
  {id: 'n11', at: 41.7},
  {id: 's2_polio1961', at: 43.2, vol: 1},
  {id: 'n12', at: 46.9},
  {id: 'ai01', at: 50.8},
  {id: 'n13', at: 55.2},
  {id: 'n14', at: 59.2},
  {id: 'n15', at: 65.0},
  {id: 'n16', at: 69.2},
  {id: 'n17', at: 75.8},
  {id: 'n18', at: 79.0},
  {id: 'n19', at: 82.6},
  {id: 'n20', at: 89.0},
  {id: 'n21', at: 91.8},
  {id: 'n22', at: 98.9},
];

export const voiceDur: Record<string, number> = {
  n01: 1.7, n02: 2.09, n03: 2.78, s1_nursing1942: 5.74, n04: 3.98, n06: 2.74, n07: 1.3, n08: 2.11, n09: 1.78,
  n10: 3.31, n11: 1.37, s2_polio1961: 3.62, n12: 3.67, ai01: 4.06, n13: 2.54, n14: 1.99, n15: 3.02, n16: 2.26,
  n17: 2.81, n18: 3.36, n19: 5.5, n20: 1.49, n21: 1.51, n22: 2.04,
};

export const sfx: {id: string; at: number; vol: number; len?: number}[] = [
  {id: 'projector', at: 0, vol: 0.16, len: 24},
  {id: 'heartbeat', at: 8.6, vol: 0.45},
  {id: 'whoosh', at: 19.2, vol: 0.35},
  {id: 'whoosh', at: 22.7, vol: 0.35},
  {id: 'impact', at: 25.25, vol: 0.75},
  {id: 'whoosh', at: 29.4, vol: 0.4},
  {id: 'tunnel', at: 32.0, vol: 0.4},
  {id: 'whoosh', at: 42.6, vol: 0.35},
  {id: 'riser', at: 61.6, vol: 0.5},
  {id: 'tunnel', at: 63.4, vol: 0.55},
  {id: 'whoosh', at: 68.1, vol: 0.35},
  {id: 'whoosh', at: 87.7, vol: 0.35},
  {id: 'sparkle', at: 96.0, vol: 0.4},
  {id: 'logo_impact', at: 98.4, vol: 0.85},
];
