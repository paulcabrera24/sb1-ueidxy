import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, setDefaultOptions, startOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock, Users, ChevronLeft, ChevronRight, Bell, Star, Trophy, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Configurar locale español
setDefaultOptions({ locale: es });

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const generateCalendarGrid = () => {
    const daysInMonth = [];
    let currentWeek = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      currentWeek.push(day);
    }
    
    daysInMonth.push(currentWeek);
    
    let currentDay = addDays(startDate, 7);
    
    while (currentDay <= monthEnd) {
      if (currentWeek.length === 7) {
        currentWeek = [];
        daysInMonth.push(currentWeek);
      }
      currentWeek.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    
    while (currentWeek.length < 7) {
      currentWeek.push(addDays(currentDay, 1));
      currentDay = addDays(currentDay, 1);
    }
    
    return daysInMonth;
  };

  const isAvailableDay = (date: Date) => {
    const day = date.getDay();
    // Ahora solo viernes (5) y sábado (6) están disponibles
    return day === 5 || day === 6;
  };

  const handleDateClick = (date: Date) => {
    if (!isAvailableDay(date)) {
      toast.error('Solo se pueden reservar eventos para viernes y sábados');
      return;
    }
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const calendarGrid = generateCalendarGrid();
  const availableEvents = days.filter(day => isAvailableDay(day)).length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Calendario de Eventos
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-600 py-2 bg-gray-50"
              >
                {day}
              </div>
            ))}

            {calendarGrid.flat().map((date, index) => {
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isCurrentDay = isToday(date);
              const available = isAvailableDay(date) && isCurrentMonth;

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={!available}
                  className={`
                    relative h-24 bg-white p-1 transition-all
                    ${!isCurrentMonth ? 'bg-gray-50' : ''}
                    ${available ? 'hover:bg-indigo-50' : ''}
                    ${isSelected ? 'bg-indigo-50 ring-2 ring-indigo-600' : ''}
                  `}
                >
                  <div className={`
                    flex flex-col h-full
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                    ${isSelected ? 'text-indigo-600' : ''}
                  `}>
                    <span className={`
                      text-sm font-semibold
                      ${isCurrentDay ? 'text-indigo-600' : ''}
                    `}>
                      {format(date, 'd')}
                    </span>
                    
                    {available && (
                      <div className="mt-auto">
                        <div className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full inline-flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{Math.floor(Math.random() * 10)} cupos</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Reservar para el {format(selectedDate, 'PPP', { locale: es })}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario Disponible
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>08:00 PM - 11:00 PM</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    toast.success('Reserva realizada con éxito');
                    setShowEventModal(false);
                  }}
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Reservar Evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;