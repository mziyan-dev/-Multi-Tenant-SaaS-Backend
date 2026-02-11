import { OrganizationFeature } from 'src/features/entities/organization-feature.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @OneToMany(() => User, user => user.organization)
  user: User[];

  @OneToMany(() => OrganizationFeature, of => of.organization)
  organizationFeatures: OrganizationFeature[];
}


