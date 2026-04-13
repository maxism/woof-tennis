export interface ScheduleTemplate {
  id: string;
  coachId: string;
  locationId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  maxPlayers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleTemplateWithLocation extends ScheduleTemplate {
  location: { id: string; name: string };
}
