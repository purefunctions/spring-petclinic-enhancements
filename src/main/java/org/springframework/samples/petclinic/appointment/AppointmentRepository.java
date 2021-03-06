package org.springframework.samples.petclinic.appointment;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.samples.petclinic.owner.Pet;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;

public interface AppointmentRepository extends Repository<Appointment, Integer> {

    @Query("SELECT astatus FROM AppointmentStatus astatus ORDER BY astatus.name")
    @Transactional(readOnly = true)
    Collection<AppointmentStatus> findAppointmentStatuses();

    @Query("SELECT astatus FROM AppointmentStatus astatus WHERE astatus.name = :name")
    @Transactional(readOnly = true)
    Optional<AppointmentStatus> findAppointmentStatus(@Param("name") String name);

    @Transactional(readOnly = true)
    Optional<Appointment> findById(Integer id);

    @Transactional(readOnly = true)
    Collection<Appointment> findAllByStatusOrderByStartTimeAscVetAsc(AppointmentStatus status);

    @Transactional(readOnly = true)
    Collection<Appointment> findAllByStatusAndPetOrderByStartTimeAsc(AppointmentStatus status, Pet pet);

    @Transactional(readOnly = true)
    @Query("SELECT appt FROM Appointment appt WHERE appt.vet.id = :vetId AND appt.status = :status ORDER BY appt.startTime ASC")
    Collection<Appointment> findAppointmentForVetId(
        @Param("status") AppointmentStatus status,
        @Param("vetId") Integer vetId
    );

    @Transactional(readOnly = true)
    @Query("SELECT appt FROM Appointment appt WHERE appt.pet.id = :petId AND appt.status = :status ORDER BY appt.startTime ASC")
    Collection<Appointment> findAppointmentForPetId(
        @Param("status") AppointmentStatus status,
        @Param("petId") Integer petId
    );

    @Transactional(readOnly = true)
    @Query("SELECT appt FROM Appointment appt WHERE appt.pet.id = :petId AND appt.vet.id = :vetId AND appt.status = :status ORDER BY appt.startTime ASC")
    Collection<Appointment> findAppointmentForPetIdAndVetId(
        @Param("status") AppointmentStatus status,
        @Param("vetId") Integer vetId,
        @Param("petId") Integer petId
    );

    @Query("SELECT appt FROM Appointment appt WHERE (appt.startTime < :intervalEnd AND appt.endTime > :intervalStart) AND appt.vet.id = :vetId  AND appt.status = :status ORDER BY appt.status ASC, appt.startTime ASC")
    @Transactional(readOnly = true)
    Collection<Appointment> findAppointmentsDuringTimeIntervalAndVetId(
        @Param("intervalStart") LocalDateTime intervalStart,
        @Param("intervalEnd") LocalDateTime intervalEnd,
        @Param("status") AppointmentStatus status,
        @Param("vetId") Integer vetId
    );

    @Query("SELECT COUNT(appt) FROM Appointment appt WHERE (appt.startTime < :intervalEnd AND appt.endTime > :intervalStart) AND appt.vet.id = :vetId  AND appt.status = :status")
    @Transactional(readOnly = true)
    Long countAppointmentsDuringTimeIntervalAndVetId(
        @Param("intervalStart") LocalDateTime intervalStart,
        @Param("intervalEnd") LocalDateTime intervalEnd,
        @Param("status") AppointmentStatus status,
        @Param("vetId") Integer vetId
    );

    @Query("SELECT COUNT(appt) FROM Appointment appt WHERE (appt.startTime < :intervalEnd AND appt.endTime > :intervalStart) AND appt.pet.id = :petId  AND appt.status = :status")
    @Transactional(readOnly = true)
    Long countAppointmentsDuringTimeIntervalAndPetId(
        @Param("intervalStart") LocalDateTime intervalStart,
        @Param("intervalEnd") LocalDateTime intervalEnd,
        @Param("status") AppointmentStatus status,
        @Param("petId") Integer petId
    );

    @Transactional
    Appointment save(Appointment appointment);
}
