import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ScheduleEntry as ScheduleEntryType } from '@/types';
import { ScheduleEntry } from './ScheduleEntry';

interface WeekViewProps {
  entries: ScheduleEntryType[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEntryClick?: (entry: ScheduleEntryType) => void;
}

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function WeekView({ entries, currentDate, onDateChange, onEntryClick }: WeekViewProps) {
  const { weekDays, entriesByDateAndHour } = useMemo(() => {
    // Get Sunday of current week
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      weekDays.push(day);
    }

    // Group entries by date and hour
    const entriesByDateAndHour: Record<string, Record<number, ScheduleEntryType[]>> = {};
    entries.forEach(entry => {
      const dateKey = entry.date;
      const hour = parseInt(entry.startTime.split(':')[0]);

      if (!entriesByDateAndHour[dateKey]) {
        entriesByDateAndHour[dateKey] = {};
      }
      if (!entriesByDateAndHour[dateKey][hour]) {
        entriesByDateAndHour[dateKey][hour] = [];
      }
      entriesByDateAndHour[dateKey][hour].push(entry);
    });

    return { weekDays, entriesByDateAndHour };
  }, [currentDate, entries]);

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    const startStr = start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800">
            {formatWeekRange()}
          </h3>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition"
          >
            Hoje
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevWeek}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <button
            onClick={nextWeek}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Week header */}
      <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50">
        <div className="p-3 text-center text-xs font-bold text-slate-500"></div>
        {weekDays.map((date, index) => (
          <div
            key={index}
            className={`p-3 text-center border-l border-slate-200 ${isToday(date) ? 'bg-indigo-50' : ''}`}
          >
            <div className="text-xs text-slate-500 uppercase">{WEEKDAYS[index].slice(0, 3)}</div>
            <div className={`text-lg font-bold ${isToday(date) ? 'text-indigo-600' : 'text-slate-800'}`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {HOURS.filter(h => h >= 6 && h <= 22).map(hour => (
          <div key={hour} className="grid grid-cols-8 border-b border-slate-100">
            <div className="p-2 text-xs text-slate-400 text-right pr-4 bg-slate-50">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDays.map((date, dayIndex) => {
              const dateStr = date.toISOString().split('T')[0];
              const hourEntries = entriesByDateAndHour[dateStr]?.[hour] || [];

              return (
                <div
                  key={dayIndex}
                  className={`min-h-[60px] p-1 border-l border-slate-100 ${isToday(date) ? 'bg-indigo-50/30' : ''}`}
                >
                  {hourEntries.map(entry => (
                    <ScheduleEntry
                      key={entry.id}
                      entry={entry}
                      compact
                      onClick={() => onEntryClick?.(entry)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
