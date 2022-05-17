import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Entities
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'text', nullable: false })
  refreshToken: string;

  @Column({ type: 'datetime', nullable: false })
  expiresAt: Date;

  @Column({ type: 'datetime', default: () => 'NOW()', nullable: false })
  createdAt: Date;
}
