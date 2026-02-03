import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ScheduleEntry as ScheduleEntryType } from '@/types';
import { ScheduleEntry } from './ScheduleEntry';

interface MonthViewProps {
  entries: ScheduleEntryType[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEntryClick?: (entry: ScheduleEntryType) => void;
  onDayClick?: (date: Date) => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function MonthView({ entries, currentDate, onDateChange, onEntryClick, onDayClick }: MonthViewProps) {
  const { days, entriesByDate } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);

    // Start from Sunday of the first week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // End at Saturday of the last week
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: Date[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Group entries by date
    const entriesByDate: Record<string, ScheduleEntryType[]> = {};
    entries.forEach(entry => {
      if (!entriesByDate[entry.date]) {
        entriesByDate[entry.date] = [];
      }
      entriesByDate[entry.date].push(entry);
    });

    return { days, entriesByDate };
  }, [currentDate, entries]);

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
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
            onClick={prevMonth}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayEntries = entriesByDate[dateStr] || [];
          const isInMonth = isCurrentMonth(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              onClick={() => onDayClick?.(date)}
              className={`min-h-[100px] p-2 border-b border-r border-slate-100 transition ${
                !isInMonth ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'
              } ${onDayClick ? 'cursor-pointer' : ''}`}
            >
              <div className={`flex items-center justify-center w-7 h-7 mb-1 rounded-full text-sm font-medium ${
                isTodayDate
                  ? 'bg-indigo-600 text-white'
                  : isInMonth
                    ? 'text-slate-700'
                    : 'text-slate-400'
              }`}>
                {date.getDate()}
              </div>

              <div className="space-y-1">
                {dayEntries.slice(0, 3).map(entry => (
                  <ScheduleEntry
                    key={entry.id}
                    entry={entry}
                    compact
                    onClick={() => onEntryClick?.(entry)}
                  />
                ))}
                {dayEntries.length > 3 && (
                  <div className="text-xs text-slate-500 text-center">
                    +{dayEntries.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
