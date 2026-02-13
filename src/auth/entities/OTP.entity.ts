import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: number;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  tempPassword: string;
}
