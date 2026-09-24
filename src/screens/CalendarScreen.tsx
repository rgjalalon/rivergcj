import {interpolateColors, useCurrentFrame} from 'remotion';
import {StatusBar} from '../components/StatusBar';
import {ChevronLeft, ChevronRight, ClockIcon} from '../components/Icons';
import {copy} from '../copy';
import {colors, fonts, softShadow} from '../theme';
import {pressScale, progress, t} from '../timeline';

const GRID_LEFT = 24;
const GRID_TOP = 228;
const CELL_W = 352 / 7;
const CELL_H = 48;
const FIRST_WEEKDAY = 3; // 1 Oct 2026 is a Thursday (Monday-first grid)
const TODAY = 13;
const SELECTED_DAY = 15;

const SLOTS_TOP = 524;
const SLOT_W = 108;
const SLOT_H = 48;
const SLOT_GAP_X = 14;
const SLOT_GAP_Y = 12;
const times = ['08:30', '09:15', '10:00', '11:30', '13:45', '15:00', '16:15', '17:30', '18:15'];
const unavailable = new Set(['09:15', '15:00']);
const SELECTED_SLOT = times.indexOf(copy.time);

const cellCenter = (day: number) => {
  const idx = FIRST_WEEKDAY + day - 1;
  return {
    x: GRID_LEFT + (idx % 7) * CELL_W + CELL_W / 2,
    y: GRID_TOP + Math.floor(idx / 7) * CELL_H + CELL_H / 2,
  };
};

const slotPos = (i: number) => ({
  x: GRID_LEFT + (i % 3) * (SLOT_W + SLOT_GAP_X),
  y: SLOTS_TOP + Math.floor(i / 3) * (SLOT_H + SLOT_GAP_Y),
});

export const DATE_TAP = cellCenter(SELECTED_DAY);
export const SLOT_TAP = {
  x: slotPos(SELECTED_SLOT).x + SLOT_W / 2,
  y: slotPos(SELECTED_SLOT).y + SLOT_H / 2,
};
export const CONTINUE_TAP = {x: 200, y: 800};

export const CalendarScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const dateSel = progress(frame, t.tapDate);
  const slotSel = progress(frame, t.tapSlot);
  const sel = cellCenter(SELECTED_DAY);

  return (
    <div style={{position: 'absolute', inset: 0, background: colors.paper, fontFamily: fonts.sans}}>
      <StatusBar />

      {/* Nav bar */}
      <div style={{position: 'absolute', top: 58, left: 16, right: 16, height: 36, display: 'flex', alignItems: 'center'}}>
        <ChevronLeft color={colors.espresso} />
        <div style={{flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 16.5, color: colors.espresso, marginRight: 22}}>
          Book a treatment
        </div>
      </div>

      {/* Treatment chip */}
      <div
        style={{
          position: 'absolute',
          top: 106,
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          borderRadius: 18,
          background: colors.cream,
          border: `1px solid ${colors.line}`,
          fontSize: 13,
          color: colors.espresso,
        }}
      >
        <ClockIcon color={colors.caramel} size={15} />
        {copy.treatment} · 45 min
      </div>

      {/* Month header */}
      <div style={{position: 'absolute', top: 152, left: 24, right: 24, display: 'flex', alignItems: 'center'}}>
        <div style={{fontFamily: fonts.serif, fontSize: 24, color: colors.espresso, flex: 1}}>{copy.month}</div>
        <div style={{display: 'flex', gap: 14}}>
          <ChevronLeft color={colors.taupe} size={20} />
          <ChevronRight color={colors.espresso} size={20} />
        </div>
      </div>

      {/* Weekdays */}
      <div style={{position: 'absolute', top: 200, left: GRID_LEFT, width: 352, display: 'flex'}}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} style={{width: CELL_W, textAlign: 'center', fontSize: 12, fontWeight: 500, color: colors.taupe}}>
            {d}
          </div>
        ))}
      </div>

      {/* Selection highlight */}
      <div
        style={{
          position: 'absolute',
          left: sel.x - 21,
          top: sel.y - 21,
          width: 42,
          height: 42,
          borderRadius: 21,
          background: colors.espresso,
          boxShadow: '0 6px 16px rgba(62,47,35,0.25)',
          opacity: dateSel,
          transform: `scale(${0.85 + 0.15 * dateSel})`,
        }}
      />

      {/* Days */}
      {Array.from({length: 31}, (_, i) => i + 1).map((day) => {
        const {x, y} = cellCenter(day);
        const weekday = (FIRST_WEEKDAY + day - 1) % 7;
        const past = day < TODAY;
        const closed = weekday === 6;
        const isSel = day === SELECTED_DAY;
        const base = past || closed ? '#CFC4B6' : colors.espresso;
        const color = isSel ? interpolateColors(dateSel, [0, 1], [base, colors.cream]) : base;
        return (
          <div
            key={day}
            style={{
              position: 'absolute',
              left: x - CELL_W / 2,
              top: y - 12,
              width: CELL_W,
              height: 24,
              textAlign: 'center',
              lineHeight: '24px',
              fontSize: 15,
              fontWeight: isSel || day === TODAY ? 600 : 400,
              color,
            }}
          >
            {day}
            {day === TODAY && (
              <div style={{position: 'absolute', left: '50%', marginLeft: -2, top: 26, width: 4, height: 4, borderRadius: 2, background: colors.caramel}} />
            )}
          </div>
        );
      })}

      {/* Times */}
      <div
        style={{
          position: 'absolute',
          top: 484,
          left: 24,
          right: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          opacity: progress(frame, t.slotsIn, 12),
        }}
      >
        <div style={{fontFamily: fonts.serif, fontSize: 20, color: colors.espresso}}>Available times</div>
        <div style={{fontSize: 13, color: colors.muted}}>{copy.dateLabel}</div>
      </div>

      {times.map((time, i) => {
        const pos = slotPos(i);
        const appear = progress(frame, t.slotsIn + 3 + i * 2, 12);
        const off = unavailable.has(time);
        const isSel = i === SELECTED_SLOT;
        const s = isSel ? slotSel : 0;
        return (
          <div
            key={time}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: SLOT_W,
              height: SLOT_H,
              borderRadius: 16,
              boxSizing: 'border-box',
              background: off
                ? 'transparent'
                : interpolateColors(s, [0, 1], ['#FFFFFF', '#F3E6D6']),
              border: `1.5px solid ${off ? colors.line : interpolateColors(s, [0, 1], [colors.line, colors.caramel])}`,
              boxShadow: off ? 'none' : `${softShadow}, 0 0 0 ${4 * s}px rgba(200,155,109,${0.18 * s})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: isSel ? 600 : 500,
              color: off ? '#CFC4B6' : colors.espresso,
              textDecoration: off ? 'line-through' : 'none',
              opacity: appear,
              transform: `translateY(${(1 - appear) * 10}px) scale(${isSel ? pressScale(frame, t.tapSlot) : 1})`,
            }}
          >
            {time}
          </div>
        );
      })}

      {/* Continue */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: CONTINUE_TAP.y - 28,
          width: 352,
          height: 56,
          borderRadius: 28,
          background: interpolateColors(slotSel, [0, 1], ['#DDD3C6', colors.espresso]),
          color: colors.cream,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: 15.5,
          transform: `scale(${pressScale(frame, t.tapContinue)})`,
          boxShadow: `0 ${10 * slotSel}px ${24 * slotSel}px rgba(62,47,35,${0.2 * slotSel})`,
        }}
      >
        <span style={{position: 'absolute', opacity: 1 - slotSel}}>Select a time</span>
        <span style={{position: 'absolute', opacity: slotSel}}>
          Continue · {copy.dateLabel}, {copy.time}
        </span>
      </div>

      <HomeIndicator />
    </div>
  );
};

export const HomeIndicator: React.FC<{color?: string}> = ({color = colors.espresso}) => (
  <div
    style={{
      position: 'absolute',
      bottom: 8,
      left: '50%',
      width: 134,
      marginLeft: -67,
      height: 5,
      borderRadius: 3,
      background: color,
    }}
  />
);
