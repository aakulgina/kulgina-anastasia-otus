import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../src/modules/users/user.entity';

describe('AuthController (e2e) Signup', () => {
	let app: INestApplication;
    let usersTable = [];

	beforeEach(async () => {
        const mockUserRepository = {
            save: jest.fn().mockImplementation(user => {
                const payload = {
                    id: Date.now(),
                    lastSeen: null,
                    ...user,
                };

                if (usersTable.find(item => item.email === user.email)) {
                    return Promise.reject('Email must be unique');
                }

                usersTable.push(payload);

                return Promise.resolve(payload);
            }),
            findOneBy: jest.fn().mockImplementation(target => {
                const properties = Object.keys(target);

                return usersTable.find(item => properties.every(prop => target[prop] === item[prop])) ?? null;
            }),
        };

		const moduleFixture: TestingModule = await Test
            .createTestingModule({
			    imports: [AppModule],
		    })
            .overrideProvider(getRepositoryToken(User))
            .useValue(mockUserRepository)
            .compile();

		app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

    afterEach(async () => {
        usersTable = [];
        await app.close();
    });

	it('/auth/signup (POST) -- 400 no email', () => {
		return request(app.getHttpServer())
			.post('/auth/signup')
            .send({
                "userName": "auth-e2e",
                "password": "qwerty123QWERTY!@#"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
			.expect(400)
			.expect({
                "message": [
                    "email must be an email",
                    "email must be a string"
                ],
                "error": "Bad Request",
                "statusCode": 400
            });
	});

	it('/auth/signup (POST) -- 400 no password', () => {
		return request(app.getHttpServer())
			.post('/auth/signup')
            .send({
                "userName": "auth-e2e",
                "email": "authe2e@gmail.com"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
			.expect(400)
			.expect({
                "message": [
                    "password is not strong enough",
                    "password must be a string"
                ],
                "error": "Bad Request",
                "statusCode": 400
            });
	});

	it('/auth/signup (POST) -- 400 weak password', () => {
		return request(app.getHttpServer())
			.post('/auth/signup')
            .send({
                "userName": "auth-e2e",
                "email": "authe2e@gmail.com",
                "password": "qwerty123"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
			.expect(400)
			.expect({
                "message": ["password is not strong enough"],
                "error": "Bad Request",
                "statusCode": 400
            });
	});

	it('/auth/signup (POST) -- 201 without username', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                "email": "authe2e@gmail.com",
                "password": "qwerty123QWERTY!@#"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect({
                "userName": "authe2e@gmail.com"
            })
	});

	it('/auth/signup (POST) -- 201 with username', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                "userName": "auth-e2e",
                "email": "auth-e2e@gmail.com",
                "password": "qwerty123QWERTY!@#"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect({
                "userName": "auth-e2e"
            })
	    });

	it('/auth/signup (POST) -- 400 user name already exists', async () => {
        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                "userName": "auth-e2e",
                "email": "auth-e2e@gmail.com",
                "password": "qwerty123QWERTY!@#"
            })
            .set('Accept', 'application/json')
            .expect(201);

        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                "userName": "auth-e2e",
                "email": "auth_e2e@gmail.com",
                "password": "qwerty123QWERTY!@#"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
			.expect(400)
			.expect({
                "message": 'User name already exists',
                "error": "Bad Request",
                "statusCode": 400
            });
	});

	it('/auth/signup (POST) -- 500 email not unique', async () => {
        await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
            "userName": "auth-e2e",
            "email": "auth-e2e@gmail.com",
            "password": "qwerty123QWERTY!@#"
        })
        .set('Accept', 'application/json')
        .expect(201);

        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                "userName": "auth-e2e-bad-email",
                "email": "auth-e2e@gmail.com",
                "password": "qwerty123QWERTY!@#"
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
			.expect(500);
	});
});
