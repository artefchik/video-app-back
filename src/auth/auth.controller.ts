import { Body, Controller, Get, HttpStatus, Post, Req, Res, UnauthorizedException, UsePipes } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, User } from '../users/dto/create-user.dto';
import { ValidationPipe } from '../pipes/validation.pipe';
import { Request, Response } from 'express';

export class AuthResponse extends User {
    @ApiProperty({ example: 'оаоаооа', description: 'Access Token' })
    accessToken: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }
    @ApiOperation({ summary: 'Log in to the system' })
    @ApiOkResponse({
        status: HttpStatus.OK,
        type:AuthResponse
    })
    @Post('/login')
    async login(
        @Body() userDto: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { refreshToken, ...user } = await this.authService.login(userDto);
        this.authService.addRefreshTokenInCookies(res, refreshToken);
        return user;
    }

    @ApiOperation({ summary: 'Registration to the system' })
    @ApiOkResponse({
        status: HttpStatus.OK,
        type:AuthResponse
    })
    @UsePipes(ValidationPipe)
    @Post('/registration')
    async registration(
        @Body() userDto: CreateUserDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { refreshToken, ...user } =
            await this.authService.registration(userDto);
        this.authService.addRefreshTokenInCookies(res, refreshToken);
        return user;
    }

    @ApiOperation({ summary: 'Log out to the system' })
    @Post('/logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        this.authService.removeRefreshTokenInCookies(res);
        return true;
    }

    @ApiOperation({ summary: 'Get token' })
    @ApiOkResponse({
        status: HttpStatus.OK,
        type:AuthResponse
    })
    @Get('/token')
    async getToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshTokenInCookies = req.cookies['refreshToken'];
        if (!refreshTokenInCookies) {
            this.authService.removeRefreshTokenInCookies(res);
            throw new UnauthorizedException('Refresh token not passed');
        }
        const { refreshToken, ...user } = await this.authService.getNewTokens(
            refreshTokenInCookies,
        );
        this.authService.addRefreshTokenInCookies(res, refreshToken);
        return user;
    }
}
