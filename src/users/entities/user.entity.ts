import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { genSalt, hash } from 'bcryptjs';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }

  @Column({ type: 'datetime', default: () => 'NOW()', nullable: false })
  createdAt: Date;

  @Column({
    type: 'datetime',
    update: true,
    default: () => 'NOW()',
    nullable: false,
  })
  updatedAt: Date;
}
