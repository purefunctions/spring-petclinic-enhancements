package org.springframework.samples.petclinic.appointment;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.samples.petclinic.owner.Pet;
import org.springframework.samples.petclinic.owner.PetRepository;
import org.springframework.samples.petclinic.vet.Vet;
import org.springframework.samples.petclinic.vet.VetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PetRepository petRepository;
    private final VetRepository vetRepository;

    private final int APPOINTMENT_DURATION_MINUTES = 30;

    AppointmentService(AppointmentRepository appointmentRepository, PetRepository petRepository, VetRepository vetRepository) {
        this.appointmentRepository = appointmentRepository;
        this.petRepository = petRepository;
        this.vetRepository = vetRepository;
    }

    @Modifying
    @Transactional
    public Appointment createNewAppointment(Integer vetId, Integer petId, LocalDateTime start, LocalDateTime end) {
        Appointment newAppointment = new Appointment();
        Pet pet = petRepository.findById(petId);
        Vet vet = vetRepository.findById(vetId);
        Optional<AppointmentStatus> status = appointmentRepository.findAppointmentStatus("scheduled");
        newAppointment.setStartTime(start);
        newAppointment.setEndTime(end);
        newAppointment.setPet(pet);
        newAppointment.setVet(vet);
        status.ifPresent(newAppointment::setStatus);
        return appointmentRepository.save(newAppointment);
    }

    public Collection<LocalDateTime> findAvailableSlotsOnDateByVetId(Integer vetId, LocalDate date) {
        if (isWeekend(date)) {
            return new ArrayList<>();
        }

        Optional<AppointmentStatus> scheduledStatus = appointmentRepository.findAppointmentStatus("scheduled");
        if (!scheduledStatus.isPresent()) {
            return new ArrayList<>();
        }
        LocalDateTime start = date.atTime(8, 0);
        LocalDateTime end = date.atTime(17, 0).minusMinutes(APPOINTMENT_DURATION_MINUTES);
        Collection<Appointment> appointmentsOnDate = this.appointmentRepository.findByBetweenStartTimeAndVetId(
            start, end, scheduledStatus.get(), vetId
        );

        ArrayList<Optional<LocalDateTime>> availableAppointmentSots = this.getPossibleAppointmentsForDate(date);

        for (Appointment appointment: appointmentsOnDate) {
            Stream<Integer> occupyingSlotIndices = getOccupyingSlotIndices(
                appointment.getStartTime().toLocalTime(),
                appointment.getEndTime().toLocalTime()
            );

            occupyingSlotIndices.forEach(
                index -> availableAppointmentSots.set(index, Optional.empty())
            );
        }

        return availableAppointmentSots.stream().filter(Optional::isPresent).map(Optional::get).collect(Collectors.toCollection(ArrayList::new));
    }

    public Collection<Appointment> findAllScheduledAppointments() {
        Optional<AppointmentStatus> scheduledStatus = appointmentRepository.findAppointmentStatus("scheduled");
        if (!scheduledStatus.isPresent()) {
            return new ArrayList<>();
        }
        return appointmentRepository.findAllByStatusOrderByStartTimeAscVetAsc(scheduledStatus.get());
    }

    public Collection<Appointment> findAllScheduledAppointmentsForVet(Integer vetId) {
        Optional<AppointmentStatus> scheduledStatus = appointmentRepository.findAppointmentStatus("scheduled");
        if (!scheduledStatus.isPresent()) {
            return new ArrayList<>();
        }

        return appointmentRepository.findAppointmentForVetId(scheduledStatus.get(), vetId);
    }

    public Collection<Appointment> findAllScheduledAppointmentsForPet(Integer petId) {
        Optional<AppointmentStatus> scheduledStatus = appointmentRepository.findAppointmentStatus("scheduled");
        if (!scheduledStatus.isPresent()) {
            return new ArrayList<>();
        }

        return appointmentRepository.findAppointmentForPetId(scheduledStatus.get(), petId);
    }

    public Collection<Appointment> findAllScheduledAppointmentsForPetAndVet(Integer petId, Integer vetId) {
        Optional<AppointmentStatus> scheduledStatus = appointmentRepository.findAppointmentStatus("scheduled");
        if (!scheduledStatus.isPresent()) {
            return new ArrayList<>();
        }

        return appointmentRepository.findAppointmentForPetIdAndVetId(scheduledStatus.get(), petId, vetId);
    }

    private boolean isWeekend(LocalDate date) {
        return (date.getDayOfWeek().getValue() == 6 || date.getDayOfWeek().getValue() == 7);
    }

    private ArrayList<Optional<LocalDateTime>> getPossibleAppointmentsForDate(LocalDate date) {
        return Stream.iterate(
            date.atTime(8,0),
            d -> d.plusMinutes(APPOINTMENT_DURATION_MINUTES)
        ).limit(
            9 * 60 / APPOINTMENT_DURATION_MINUTES
        ).map(
            Optional::of
        ).collect(
            Collectors.toCollection(ArrayList::new)
        );
    }

    private Optional<Integer> getSlotIndexByTime(LocalTime time) {
        if(time.isBefore(LocalTime.of(8, 0)) || time.isAfter(LocalTime.of(17,0).minusMinutes(APPOINTMENT_DURATION_MINUTES))) {
            return Optional.empty();
        }
        LocalTime normalizedTime = time.minusHours(8);
        int minutesSinceMidnight = normalizedTime.getHour() * 60 + normalizedTime.getMinute();
        return Optional.of(minutesSinceMidnight / APPOINTMENT_DURATION_MINUTES);
    }

    private Stream<Integer> getOccupyingSlotIndices(LocalTime startTime, LocalTime endTime) {
        LocalTime dayBegin = LocalTime.of(8, 0);
        LocalTime dayEnd = LocalTime.of(17, 0);
        if(startTime.isBefore(dayBegin) && endTime.isAfter(dayEnd)) {
            return IntStream.empty().boxed();
        }
        Integer startIndex = getSlotIndexByTime(startTime).orElse(0);
        Integer endIndex = getSlotIndexByTime(endTime).orElse((9 * 60 / APPOINTMENT_DURATION_MINUTES) - 1);
        return IntStream.range(startIndex, endIndex + 1).boxed();
    }
}
