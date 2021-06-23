class CreateIssueBoards < ActiveRecord::Migration[6.1]
  def change
    create_table :issue_boards do |t|
      t.string :name
      t.belongs_to :user, null: true, foreign_key: "user_id"
      t.belongs_to :group, null: true, foreign_key: "group_id"
      
      t.timestamps
    end
  end
end
