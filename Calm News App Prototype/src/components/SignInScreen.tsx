import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

interface SignInScreenProps {
  onSignIn: () => void;
}

export function SignInScreen({ onSignIn }: SignInScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl tracking-tight text-foreground mb-2">Up-to-date</h1>
          <p className="text-muted-foreground">BBC News, processed with care</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 border-border"
            onClick={onSignIn}
          >
            Continue with Google
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12 border-border"
            onClick={onSignIn}
          >
            Continue with Apple
          </Button>

          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-input-background border-border"
            />
            <Button
              className="w-full h-12 bg-primary text-primary-foreground"
              onClick={onSignIn}
            >
              Continue with Email
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed">
          By continuing, you'll access BBC News content processed through AI to create neutral headlines and calm summaries.
        </p>
      </div>
    </div>
  );
}