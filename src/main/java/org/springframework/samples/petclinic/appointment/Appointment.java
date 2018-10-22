package org.springframework.samples.petclinic.appointment;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.samples.petclinic.model.BaseEntity;
import org.springframework.samples.petclinic.owner.Pet;
import org.springframework.samples.petclinic.vet.Vet;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments", uniqueConstraints = {@UniqueConstraint(columnNames = {"vet_id", "start_time"}),
                                                    @UniqueConstraint(columnNames = {"pet_id", "start_time"})})
public class Appointment extends BaseEntity {
    @Column(name = "start_time")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "vet_id")
    private Vet vet;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private AppointmentStatus status;

    public LocalDateTime getStartTime() {
        return this.startTime;
    }

    public void setStartTime(LocalDateTime startTime) {this.startTime = startTime;}

    public LocalDateTime getEndTime() {
        return this.endTime;
    }
    public void setEndTime(LocalDateTime endTime) {this.endTime = endTime;}

    public AppointmentStatus getStatus() {
        return this.status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public Pet getPet() {
        return this.pet;
    }

    public void setPet(Pet pet) {this.pet = pet;}

    public Vet getVet() {
        return this.vet;
    }

    public void setVet(Vet vet) {this.vet = vet;}

}
