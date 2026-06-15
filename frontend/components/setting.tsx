"use client";

import { Button } from "@/components/ui/button";
import { IconSettings } from "@tabler/icons-react";
import { IconHome2 } from "@tabler/icons-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Account } from "./account";

export function Setting() {
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="rounded-xl bg-neutral-800">
            <IconSettings stroke={2} />
            Setting
          </Button>
        }
      />
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel></DropdownMenuLabel>
          <DropdownMenuItem className="">
            <Link href="/" className="flex gap-2">
              <IconHome2 stroke={2} className="mt-0.5" />
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Account></Account>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogOut}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
