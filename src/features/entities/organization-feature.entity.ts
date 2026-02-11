import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Feature } from './feature.entity';
import { Organization } from 'src/organization/entities/organization.entity';

@Entity()
@Unique(['organization', 'feature'])
export class OrganizationFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization, (org) => org.organizationFeatures, { onDelete: 'CASCADE' })
  organization: Organization;

  @ManyToOne(() => Feature, { eager: true })
  feature: Feature;

  @Column({ default: true })
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
