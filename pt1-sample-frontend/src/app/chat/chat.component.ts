import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private chat : ChatService, private formBuilder : FormBuilder) { }

  messages : Object[] = [];
  chatForm = this.formBuilder.group({
    message : ""
  });

  ngOnInit(): void {
    this.chat.get().subscribe((data) => this.messages.push(data));
  }

  onSubmit(){
    this.chat.send(this.chatForm.value);
    this.chatForm.reset();
  }


}
