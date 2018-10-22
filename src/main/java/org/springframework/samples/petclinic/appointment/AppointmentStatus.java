package org.springframework.samples.petclinic.appointment;

import org.springframework.samples.petclinic.model.NamedEntity;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "appointment_statuses", uniqueConstraints = @UniqueConstraint(columnNames = {"id", "name"}))
public class AppointmentStatus  extends NamedEntity {
}

