import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @ApiProperty({})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({})
  @Column({ unique: true })
  email: string;

  @ApiProperty({})
  @Column({ unique: true, nullable: true })
  username: string;

  @ApiProperty({})
  @Column({ nullable: true })
  description: string;

  @ApiProperty({})
  @Column()
  name: string;

  @ApiProperty({})
  @Column({ nullable: true })
  imageBackgroundUrl: string;

  @ApiProperty({})
  @Column({ nullable: true })
  imageProfileUrl: string;

  @ApiProperty({})
  @Column()
  password: string;
}
